// Firebase Admin SDK (server-side)
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

if (!admin.apps.length) {
  let adminConfig: any = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };

  // Try to load service account key
  const keyPath = path.join(process.cwd(), "firebase-admin-key.json");

  if (fs.existsSync(keyPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      adminConfig = {
        ...adminConfig,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
      };
    } catch (error) {
      console.warn("⚠️  Could not parse firebase-admin-key.json:", error);
      console.warn(
        "Using fallback mode. For production, download the key from Firebase Console."
      );
    }
  } else {
    console.warn(
      "\n⚠️  firebase-admin-key.json not found at root directory"
    );
    console.warn("📝 Steps to fix:");
    console.warn("1. Go to: https://console.firebase.google.com");
    console.warn("2. Project Settings → Service Accounts");
    console.warn("3. Click 'Generate New Private Key'");
    console.warn(
      "4. Save as firebase-admin-key.json in the root directory\n"
    );
    console.warn(
      "⚠️  Running in fallback mode - some features may not work!\n"
    );
  }

  admin.initializeApp(adminConfig);
  // Ignore undefined properties in Firestore
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;

export type AdminAuth = admin.auth.Auth;
export type AdminDb = admin.firestore.Firestore;
