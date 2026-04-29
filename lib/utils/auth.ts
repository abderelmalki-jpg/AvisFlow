// Server-side auth helpers (use only in server actions and API routes)
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { User } from "@/lib/types";
import { createUser } from "@/lib/db/mutations";

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
