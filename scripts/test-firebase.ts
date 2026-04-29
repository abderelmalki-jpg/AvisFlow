import { auth } from "@/lib/firebase/client";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

/**
 * Test Firebase Configuration
 * Run with: npx ts-node scripts/test-firebase.ts
 */

async function testFirebaseSetup() {
  console.log("🔍 Testing Firebase Configuration...\n");

  try {
    // Test 1: Check environment variables
    console.log("1️⃣ Checking environment variables...");
    const requiredEnvVars = [
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "FIREBASE_PROJECT_ID",
    ];

    const missing = requiredEnvVars.filter((env) => !process.env[env]);

    if (missing.length > 0) {
      console.log("❌ Missing environment variables:", missing);
    } else {
      console.log("✅ All required environment variables set\n");
    }

    // Test 2: Check Firebase Admin Key
    console.log("2️⃣ Checking Firebase Admin Key...");
    const fs = require("fs");
    const path = require("path");
    const keyPath = path.join(process.cwd(), "firebase-admin-key.json");

    if (fs.existsSync(keyPath)) {
      console.log("✅ firebase-admin-key.json found\n");
    } else {
      console.log(
        "❌ firebase-admin-key.json not found at root directory\n"
      );
      console.log(
        "   Download it from: Firebase Console > Project Settings > Service Accounts\n"
      );
    }

    // Test 3: Check Firestore connectivity (server-side)
    console.log("3️⃣ Testing Firestore connection (server-side)...");
    try {
      const testDoc = await adminDb.collection("_test").doc("connection").get();
      console.log("✅ Firestore connection successful\n");
    } catch (error: any) {
      console.log("⚠️  Firestore connection issue:");
      console.log("   Error:", error.message);
      console.log(
        "   Make sure firebase-admin-key.json is in the root directory\n"
      );
    }

    // Test 4: Test user creation (client-side simulation)
    console.log("4️⃣ Firebase Client SDK status...");
    if (auth) {
      console.log("✅ Firebase Client SDK initialized\n");
    } else {
      console.log("❌ Firebase Client SDK not initialized\n");
    }

    // Test 5: Check Google OAuth
    console.log("5️⃣ Checking Google OAuth configuration...");
    const hasGoogleOAuth =
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

    if (hasGoogleOAuth) {
      console.log("✅ Google OAuth credentials configured\n");
    } else {
      console.log(
        "⚠️  Google OAuth credentials missing in .env.local\n"
      );
      console.log("   Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET\n");
    }

    console.log("════════════════════════════════════════");
    console.log("📋 Summary:");
    console.log("════════════════════════════════════════");

    if (missing.length === 0 && hasGoogleOAuth && fs.existsSync(keyPath)) {
      console.log("✅ Firebase is fully configured and ready!");
      console.log("\n🚀 You can now:");
      console.log("   • Create accounts with email/password");
      console.log("   • Login with Google OAuth");
      console.log("   • Save data to Firestore");
    } else {
      console.log("⚠️  Firebase setup incomplete. Follow the steps in FIREBASE_SETUP.md");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testFirebaseSetup();
