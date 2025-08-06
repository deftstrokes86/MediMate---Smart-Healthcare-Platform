
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from 'uuid';

admin.initializeApp();

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`New user created: ${user.uid}`, {structuredData: true});
  
  const userDocRef = db.collection("users").doc(user.uid);
  
  try {
    // Small delay to allow Firestore document creation from client
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
        functions.logger.warn(`User document not found for uid: ${user.uid}`);
        return null;
    }
    
    const roles = userDoc.data()?.roles;
    if (!roles) {
        functions.logger.warn(`No roles found for user: ${user.uid}`);
        return null;
    }
    const role = Object.keys(roles).find(r => roles[r] === true);

    if (role) {
      await admin.auth().setCustomUserClaims(user.uid, { role: role });
      functions.logger.info(`Custom claim set for user: ${user.uid}`, { role: role });
    } else {
       functions.logger.warn(`No role found for user: ${user.uid}`);
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
