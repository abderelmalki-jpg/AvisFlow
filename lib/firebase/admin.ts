// Firebase Admin SDK (server-side)
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

if (!admin.apps.length) {
  let adminConfig: admin.AppOptions = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };

  // Try to load service account key if available (local development)
  const keyPath = path.join(process.cwd(), "firebase-admin-key.json");
  if (fs.existsSync(keyPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      adminConfig.privateKey = serviceAccount.private_key;
      adminConfig.clientEmail = serviceAccount.client_email;
    } catch (error) {
      console.warn("⚠️ Could not parse firebase-admin-key.json:", error);
    }
  } else if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ firebase-admin-key.json not found. Using Application Default Credentials.");
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
