
import admin from "firebase-admin";

function initializeFirebaseAdmin() {
  if (admin.apps.length) return admin;

  let credential;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (error) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must be valid JSON.", {
        cause: error,
      });
    }

    credential = admin.credential.cert(serviceAccount);
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  } else {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GCLOUD_PROJECT) {
      console.warn(
        "Firebase Admin credentials are not configured. Server auth will fail until GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON is set."
      );
    }
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
  });

  return admin;
}

export const firebaseAdmin = initializeFirebaseAdmin();
