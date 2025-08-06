
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`New user created: ${user.uid}`, {structuredData: true});
  
  const userDocRef = db.collection("users").doc(user.uid);
  
  try {
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
