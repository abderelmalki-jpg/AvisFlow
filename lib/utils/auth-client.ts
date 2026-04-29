// Client-side auth helpers (safe to use in components)
import { auth } from "@/lib/firebase/client";

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

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
