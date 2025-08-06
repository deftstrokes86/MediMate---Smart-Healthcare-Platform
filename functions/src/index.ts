
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// This function is a placeholder and should be adapted based on how the role
// is passed from the client during sign-up. One common method is to have the client
// write the intended role to a temporary Firestore document, which this function then reads.
// For this implementation, we'll assume the client creates the user/profile docs
// and this function's primary role is to set custom claims if needed.

// For simplicity, we are letting the client-side code handle document creation.
// In a production scenario, you might move that logic into this function
// to ensure it runs in a secure server environment.

// For example, on a new user creation, you could trigger this function,
// read role data written by the client to a 'pending_roles' collection,
// set the custom claim, and then create the 'users' and 'profiles' documents here.

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  functions.logger.info(`New user created: ${user.uid}`, {structuredData: true});
  
  // Default role is 'patient'. In a real app, you would get this from a temporary
  // doc written by the client during sign-up.
  const role = "patient"; 
  
  try {
    // Set custom claim for Role-Based Access Control (RBAC)
    await admin.auth().setCustomUserClaims(user.uid, { role: role });
    functions.logger.info(`Custom claim set for user: ${user.uid}`, { role: role });

    // The client-side code is handling the creation of user and profile documents.
    // If you move that logic here, you would add it below.
    // For example:
    //
    // const userDocRef = db.collection("users").doc(user.uid);
    // await userDocRef.set({
    //   email: user.email,
    //   displayName: user.displayName,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    //   roles: { [role]: true }
    // });
    //
    // const profileDocRef = db.collection("profiles").doc(user.uid);
    // await profileDocRef.set({
    //    patientData: { /* initial data */ }
    // });
    
    return null;
  } catch (error) {
    functions.logger.error("Error setting custom claim or creating user docs:", error);
    return null;
  }
});
