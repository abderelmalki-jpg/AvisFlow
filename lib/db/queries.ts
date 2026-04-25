// Firestore query helpers
import { adminDb } from "@/lib/firebase/admin";
import {
  Business,
  Location,
  Review,
  GeneratedReply,
  User,
  BrandVoice,
} from "@/lib/types";

export const getUserById = async (userId: string): Promise<User | null> => {
  const doc = await adminDb.collection("users").doc(userId).get();
  return doc.exists ? (doc.data() as User) : null;
};

export const getBusinessById = async (
  businessId: string
): Promise<Business | null> => {
  const doc = await adminDb.collection("businesses").doc(businessId).get();
  return doc.exists ? (doc.data() as Business) : null;
};

export const getBusinessesByUser = async (userId: string): Promise<Business[]> => {
  const snapshot = await adminDb
    .collection("businesses")
    .where("members", "array-contains", userId)
    .get();
  return snapshot.docs.map((doc) => doc.data() as Business);
};

export const getLocationsByBusiness = async (
  businessId: string
): Promise<Location[]> => {
  const snapshot = await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("locations")
    .get();
  return snapshot.docs.map((doc) => doc.data() as Location);
};

export const getLocationById = async (
  businessId: string,
  locationId: string
): Promise<Location | null> => {
  const doc = await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("locations")
    .doc(locationId)
    .get();
  return doc.exists ? (doc.data() as Location) : null;
};

export const getReviewsByBusiness = async (
  businessId: string,
  status?: "pending" | "replied" | "archived"
): Promise<Review[]> => {
  let query: any = adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("reviews");

  if (status) {
    query = query.where("status", "==", status);
  }

  const snapshot = await query.orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as Review);
};

export const getReviewById = async (
  businessId: string,
  reviewId: string
): Promise<Review | null> => {
  const doc = await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("reviews")
    .doc(reviewId)
    .get();
  return doc.exists ? (doc.data() as Review) : null;
};

export const getGeneratedReplyById = async (
  businessId: string,
  replyId: string
): Promise<GeneratedReply | null> => {
  const doc = await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("generatedReplies")
    .doc(replyId)
    .get();
  return doc.exists ? (doc.data() as GeneratedReply) : null;
};

export const getBrandVoicesByBusiness = async (
  businessId: string
): Promise<BrandVoice[]> => {
  const snapshot = await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("brandVoices")
    .get();
  return snapshot.docs.map((doc) => doc.data() as BrandVoice);
};

export const getDefaultBrandVoice = async (
  businessId: string
): Promise<BrandVoice | null> => {
  const snapshot = await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("brandVoices")
    .where("isDefault", "==", true)
    .get();

  if (snapshot.docs.length === 0) return null;
  return snapshot.docs[0].data() as BrandVoice;
};
