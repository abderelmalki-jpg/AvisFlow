"use server";

import { adminDb } from "@/lib/firebase/admin";
import { verifyIdToken } from "@/lib/utils/auth";
import {
  createBusiness,
  createLocation,
  createBrandVoice,
} from "@/lib/db/mutations";
import { getBusinessById } from "@/lib/db/queries";
import { Business, Location, BrandVoice } from "@/lib/types";

interface ServerActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Verify auth token in all server actions
const verifyAuth = async (token?: string) => {
  if (!token) {
    throw new Error("No auth token provided");
  }
  return verifyIdToken(token);
};

// BUSINESS ACTIONS
export async function createBusinessAction(
  token: string,
  data: { name: string; industry: string }
): Promise<ServerActionResponse<Business>> {
  try {
    const decoded = await verifyAuth(token);
    const business = await createBusiness(decoded.uid, data);
    return { success: true, data: business };
  } catch (error) {
    console.error("Error creating business:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create business",
    };
  }
}

// LOCATION ACTIONS
export async function createLocationAction(
  token: string,
  businessId: string,
  data: { name: string; address: string; placeId?: string }
): Promise<ServerActionResponse<Location>> {
  try {
    const decoded = await verifyAuth(token);
    const business = await getBusinessById(businessId);

    // Verify user owns business
    if (!business || business.ownerId !== decoded.uid) {
      throw new Error("Unauthorized");
    }

    const location = await createLocation(businessId, data);
    return { success: true, data: location };
  } catch (error) {
    console.error("Error creating location:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create location",
    };
  }
}

// GOOGLE OAUTH ACTIONS
export async function saveGoogleTokenAction(
  token: string,
  businessId: string,
  googleAccessToken: string,
  googleRefreshToken?: string,
  googleAccountId?: string
): Promise<ServerActionResponse<void>> {
  try {
    const decoded = await verifyAuth(token);
    const business = await getBusinessById(businessId);

    // Verify user owns business
    if (!business || business.ownerId !== decoded.uid) {
      throw new Error("Unauthorized");
    }

    // TODO: Encrypt tokens before storing
    await adminDb.collection("businesses").doc(businessId).update({
      googleAccessToken,
      googleRefreshToken,
      googleAccountId,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving Google token:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save Google token",
    };
  }
}

// BRAND VOICE ACTIONS
export async function createBrandVoiceAction(
  token: string,
  businessId: string,
  data: {
    name: string;
    description: string;
    examples: Array<{ review: string; replyTemplate: string }>;
    systemPromptSegment: string;
  }
): Promise<ServerActionResponse<BrandVoice>> {
  try {
    const decoded = await verifyAuth(token);
    const business = await getBusinessById(businessId);

    // Verify user owns business
    if (!business || business.ownerId !== decoded.uid) {
      throw new Error("Unauthorized");
    }

    const voice = await createBrandVoice(businessId, data);
    return { success: true, data: voice };
  } catch (error) {
    console.error("Error creating brand voice:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create brand voice",
    };
  }
}
