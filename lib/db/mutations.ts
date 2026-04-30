// Firestore mutation helpers
import { adminDb, FieldValue } from "@/lib/firebase/admin";
import {
  Business,
  Location,
  Review,
  GeneratedReply,
  User,
  BrandVoice,
} from "@/lib/types";

export const createUser = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  const user: User = {
    id: userId,
    email: data.email || "",
    displayName: data.displayName || "",
    photoUrl: data.photoUrl,
    businesses: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await adminDb.collection("users").doc(userId).set(user);
  return user;
};

export const createBusiness = async (
  ownerId: string,
  data: {
    name: string;
    industry: string;
  }
): Promise<Business> => {
  const businessId = adminDb.collection("businesses").doc().id;
  const business: Business = {
    id: businessId,
    ownerId,
    name: data.name,
    industry: data.industry as Business["industry"],
    subscriptionStatus: "trialing",
    monthlyQuota: 50,
    currentMonthUsage: 0,
    members: { [ownerId]: "owner" },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await adminDb.collection("businesses").doc(businessId).set(business);

  // Add to user's businesses (or create user if doesn't exist)
  await adminDb
    .collection("users")
    .doc(ownerId)
    .set(
      {
        businesses: FieldValue.arrayUnion(businessId),
      },
      { merge: true }
    );

  return business;
};

export const createLocation = async (
  businessId: string,
  data: {
    name: string;
    address: string;
    placeId?: string;
  }
): Promise<Location> => {
  const locationId = adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("locations")
    .doc().id;

  const location: Location = {
    id: locationId,
    businessId,
    name: data.name,
    address: data.address,
    placeId: data.placeId,
    reviewCount: 0,
    settings: {
      autoApproveRating4Plus: true,
      requireManualReviewRating123: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("locations")
    .doc(locationId)
    .set(location);

  return location;
};

export const createReview = async (
  businessId: string,
  data: {
    locationId: string;
    googleReviewId: string;
    googleAuthorName: string;
    rating: number;
    text: string;
    sentiment?: string;
  }
): Promise<Review> => {
  const reviewId = adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("reviews")
    .doc().id;

  const review: Review = {
    id: reviewId,
    businessId,
    locationId: data.locationId,
    googleReviewId: data.googleReviewId,
    googleAuthorName: data.googleAuthorName,
    rating: data.rating,
    text: data.text,
    sentiment: data.sentiment as Review["sentiment"],
    status: "pending",
    createdAt: new Date(),
    syncedAt: new Date(),
  };

  await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("reviews")
    .doc(reviewId)
    .set(review);

  return review;
};

export const createGeneratedReply = async (
  businessId: string,
  data: {
    reviewId: string;
    brandVoiceId: string;
    generatedText: string;
    tokenUsage: number;
  }
): Promise<GeneratedReply> => {
  const replyId = adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("generatedReplies")
    .doc().id;

  const reply: GeneratedReply = {
    id: replyId,
    businessId,
    reviewId: data.reviewId,
    brandVoiceId: data.brandVoiceId,
    generatedText: data.generatedText,
    status: "draft",
    tokenUsage: data.tokenUsage,
    generatedAt: new Date(),
  };

  await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("generatedReplies")
    .doc(replyId)
    .set(reply);

  return reply;
};

export const updateReplyStatus = async (
  businessId: string,
  replyId: string,
  status: "draft" | "approved" | "published" | "rejected",
  userId?: string
): Promise<void> => {
  const update: Partial<GeneratedReply> & { approvedAt?: Date; approvedBy?: string; updatedAt: Date } = {
    status,
    updatedAt: new Date(),
  };

  if (status === "approved") {
    update.approvedAt = new Date();
    update.approvedBy = userId;
  }

  await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("generatedReplies")
    .doc(replyId)
    .update(update);
};

export const updateReviewStatus = async (
  businessId: string,
  reviewId: string,
  status: "pending" | "replied" | "archived"
): Promise<void> => {
  await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("reviews")
    .doc(reviewId)
    .update({
      status,
      updatedAt: new Date(),
      ...(status === "replied" && { repliedAt: new Date() }),
    });
};

export const incrementBusinessUsage = async (
  businessId: string
): Promise<number> => {
  await adminDb
    .collection("businesses")
    .doc(businessId)
    .update({
      currentMonthUsage: FieldValue.increment(1),
    });

  // Return new value (requires a follow-up query)
  const doc = await adminDb.collection("businesses").doc(businessId).get();
  return (doc.data() as Business).currentMonthUsage;
};

export const createBrandVoice = async (
  businessId: string,
  data: {
    name: string;
    description: string;
    examples: Array<{ review: string; replyTemplate: string }>;
    systemPromptSegment: string;
  }
): Promise<BrandVoice> => {
  const voiceId = adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("brandVoices")
    .doc().id;

  const voice: BrandVoice = {
    id: voiceId,
    businessId,
    name: data.name,
    description: data.description,
    examples: data.examples,
    systemPromptSegment: data.systemPromptSegment,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await adminDb
    .collection("businesses")
    .doc(businessId)
    .collection("brandVoices")
    .doc(voiceId)
    .set(voice);

  return voice;
};

export const updateBusinessGoogleToken = async (
  businessId: string,
  googleAccessToken: string,
  googleRefreshToken?: string,
  googleAccountId?: string
): Promise<void> => {
  const update: Partial<Business> & { updatedAt: Date } = {
    googleAccessToken,
    updatedAt: new Date(),
  };

  if (googleRefreshToken) {
    update.googleRefreshToken = googleRefreshToken;
  }

  if (googleAccountId) {
    update.googleAccountId = googleAccountId;
  }

  await adminDb.collection("businesses").doc(businessId).update(update);
};
