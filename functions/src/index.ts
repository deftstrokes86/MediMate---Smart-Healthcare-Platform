
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from 'uuid';

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`New user created: ${user.uid}`, {structuredData: true});
  
  const userDocRef = db.collection("users").doc(user.uid);
  
  try {
    // Small delay to allow Firestore document creation from client
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
        functions.logger.warn(`User document not found for uid: ${user.uid}, cannot set custom claims.`);
        return null;
    }
    
    const roles = userDoc.data()?.roles;
    if (!roles) {
        functions.logger.warn(`No roles found for user: ${user.uid}, cannot set custom claims.`);
        return null;
    }
    const role = Object.keys(roles).find(r => roles[r] === true);

    if (role) {
      await admin.auth().setCustomUserClaims(user.uid, { role: role });
      functions.logger.info(`Custom claim set for user: ${user.uid}`, { role: role });
    } else {
       functions.logger.warn(`No primary role found for user: ${user.uid}`);
    }

    return null;
  } catch (error) {
    functions.logger.error("Error setting custom claim or creating user docs:", error);
    return null;
  }
});


export const inviteAdmin = functions.https.onCall(async (data, context) => {
    // Check if the caller is a super admin
    if (context.auth?.token.role !== 'super_admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only super admins can invite new admins.');
    }

    const { invitedEmail, invitedBy } = data;

    if (!invitedEmail || !invitedBy) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with an "invitedEmail" and "invitedBy" argument.');
    }

    try {
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

        const inviteRef = db.collection('adminInvites').doc(token);
        await inviteRef.set({
            email: invitedEmail,
            invitedBy: invitedBy,
            status: 'valid',
            createdAt: new Date(),
            expiresAt: expiresAt,
        });

        functions.logger.info(`Admin invite created for ${invitedEmail} by ${invitedBy}. Token: ${token}`);
        return { success: true, token: token };
    } catch (error) {
        functions.logger.error('Error creating admin invite:', error);
        throw new functions.https.HttpsError('internal', 'Could not create admin invite.');
    }
});


// KYC and Verification Functions

/**
 * Generates a signed URL for a client to upload a file to a secure Storage path.
 */
export const generateSignedUploadUrl = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to upload files.');
    }

    const { filename, contentType, docType } = data;
    const uid = context.auth.uid;
    const docId = uuidv4();
    const storagePath = `private/kyc/${uid}/${docId}-${filename}`;

    const [uploadUrl] = await storage.bucket().file(storagePath).getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType,
    });

    // Create a metadata document in Firestore
    const kycDocRef = db.collection('kyc_docs').doc(uid).collection('docs').doc(docId);
    await kycDocRef.set({
        docId,
        storagePath,
        mimeType: contentType,
        docType,
        uploadedBy: uid,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        virusScanStatus: 'pending',
        ocrStatus: 'pending',
        reviewNote: null,
    });

    return { uploadUrl, storagePath, docId };
});

/**
 * Generates a short-lived read-only signed URL for a file.
 */
export const generateSignedDownloadUrl = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in.');
    }
    
    const { storagePath, uid } = data;
    const requestorUid = context.auth.uid;
    const requestorRole = context.auth.token.role;

    // Security check: Only owner or admin can download
    if (requestorUid !== uid && requestorRole !== 'admin' && requestorRole !== 'super_admin') {
         throw new functions.https.HttpsError('permission-denied', 'You do not have permission to view this file.');
    }

    const [downloadUrl] = await storage.bucket().file(storagePath).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    return { downloadUrl };
});


/**
 * Approves or rejects a provider's verification status.
 */
export const verifyProvider = functions.https.onCall(async (data, context) => {
    if (context.auth?.token.role !== 'admin' && context.auth?.token.role !== 'super_admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can perform this action.');
    }
    
    const { uid, action, note } = data; // action: 'approve' | 'reject'
    const adminUid = context.auth.uid;

    const profileRef = db.collection('profiles').doc(uid);
    const verificationRef = db.collection('verifications').doc(uid).collection('history').doc();
    const auditRef = db.collection('audits').doc();

    const writeBatch = db.batch();

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // 1. Update Profile
    writeBatch.update(profileRef, {
        isVerified: action === 'approve',
        verificationStatus: newStatus,
        verificationReviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Set Auth Custom Claim
    if (action === 'approve') {
        await admin.auth().setCustomUserClaims(uid, { ...context.auth.token, verified: true });
    } else {
        await admin.auth().setCustomUserClaims(uid, { ...context.auth.token, verified: false });
    }

    // 3. Log Verification History
    writeBatch.set(verificationRef, {
        status: newStatus,
        note: note || null,
        reviewedBy: adminUid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // 4. Log Audit Event
     writeBatch.set(auditRef, {
        action: `verification_${action}`,
        actor: adminUid,
        target: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        details: { note: note || null },
    });

    await writeBatch.commit();

    return { success: true, newStatus };
});


// STUB FUNCTIONS - To be implemented with real services

export const onKycUploadFinalize = functions.storage.object().onFinalize(async (object) => {
    const filePath = object.name;
    if (filePath && filePath.startsWith('private/kyc/')) {
        functions.logger.info(`File uploaded: ${filePath}. Stub: Triggering scan.`);
        // In a real app, you would publish a message to a Pub/Sub topic
        // that triggers the virusScanWorker and ocrProcessor.
    }
    return null;
});

export const virusScanWorker = functions.https.onRequest((req, res) => {
    functions.logger.info("STUB: Virus scan worker called. Marking file as clean.");
    res.send("STUB: File marked as clean.");
});

export const ocrProcessor = functions.https.onRequest((req, res) => {
    functions.logger.info("STUB: OCR processor called. Extracting text.");
    res.send("STUB: OCR complete.");
});

export const expiryMonitor = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    functions.logger.info('STUB: Running daily license expiry check.');
    // Query for profiles where kyc.licenseExpiry is in the past.
    // Create notifications or audits.
    return null;
});
