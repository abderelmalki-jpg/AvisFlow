// Auth helpers
import { auth } from "@/lib/firebase/client";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { User } from "@/lib/types";
import { createUser } from "@/lib/db/mutations";

export const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const idToken = await user.getIdToken();
    return { user, idToken };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new Error("Unauthorized");
  }
};

export const getOrCreateUser = async (
  uid: string,
  email: string,
  displayName?: string
): Promise<User> => {
  // Check if user exists
  const existingUser = await adminDb.collection("users").doc(uid).get();

  if (existingUser.exists) {
    return existingUser.data() as User;
  }

  // Create new user
  return createUser(uid, {
    email,
    displayName: displayName || email.split("@")[0],
  });
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
