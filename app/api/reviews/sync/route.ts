import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import {
  getBusinessById,
  getLocationsByBusiness,
  getReviewsByBusiness,
} from "@/lib/db/queries";
import { createReview } from "@/lib/db/mutations";
import { googleBusinessApi } from "@/lib/google/api";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const decoded = await verifyIdToken(token);
    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "Missing businessId" },
        { status: 400 }
      );
    }

    // Verify user owns business
    const business = await getBusinessById(businessId);
    if (!business || business.ownerId !== decoded.uid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if Google token is available
    console.log("Sync start - Business data:", {
      id: business.id,
      hasGoogleToken: !!business.googleAccessToken,
      hasGoogleAccountId: !!business.googleAccountId,
      googleAccountId: business.googleAccountId,
    });

    if (!business.googleAccessToken) {
      console.error("No Google access token for business:", businessId);
      return NextResponse.json(
        { error: "Google Business Profile not connected. Please connect your Google account." },
        { status: 400 }
      );
    }

    if (!business.googleAccountId) {
      console.error("No Google account ID for business:", businessId);
      return NextResponse.json(
        { error: "Google account ID not found. Please reconnect your Google Business Profile." },
        { status: 400 }
      );
    }

    // Get locations for the business
    const locations = await getLocationsByBusiness(businessId);
    if (locations.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No locations found",
        reviewsImported: 0,
      });
    }

    // Get existing reviews to check for duplicates
    const existingReviews = await getReviewsByBusiness(businessId);
    const existingGoogleIds = new Set(
      existingReviews.map((r) => r.googleReviewId)
    );

    let reviewsImported = 0;

    // Sync reviews for each location
    for (const location of locations) {
      try {
        // Build location name for Google My Business API
        // Format: accounts/{accountId}/locations/{locationId}
        const locationName = `accounts/${business.googleAccountId}/locations/${location.placeId}`;

        // Fetch reviews from Google
        const googleResponse = await googleBusinessApi.getReviews(
          locationName,
          business.googleAccessToken
        );

        const googleReviews = googleResponse.reviews || [];

        // Create new reviews, skipping duplicates
        for (const googleReview of googleReviews) {
          if (!existingGoogleIds.has(googleReview.reviewId)) {
            await createReview(businessId, {
              locationId: location.id,
              googleReviewId: googleReview.reviewId,
              googleAuthorName: googleReview.reviewer?.displayName || "Anonymous",
              rating: googleReview.rating || 5,
              text: googleReview.comment || googleReview.reviewReply?.comment || "",
              sentiment:
                googleReview.rating >= 4
                  ? "positive"
                  : googleReview.rating >= 3
                    ? "neutral"
                    : "negative",
            });
            reviewsImported++;
          }
        }
      } catch (error) {
        console.error(
          `Error syncing reviews for location ${location.id}:`,
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${reviewsImported} new reviews`,
      reviewsImported,
    });
  } catch (error) {
    console.error("Error syncing reviews:", error);
    return NextResponse.json(
      { error: "Failed to sync reviews" },
      { status: 500 }
    );
  }
}
