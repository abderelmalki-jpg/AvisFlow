import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import { getBusinessById, getReviewById, getDefaultBrandVoice } from "@/lib/db/queries";
import { createGeneratedReply, incrementBusinessUsage } from "@/lib/db/mutations";

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
    const { businessId, reviewId } = await request.json();

    if (!businessId || !reviewId) {
      return NextResponse.json(
        { error: "Missing businessId or reviewId" },
        { status: 400 }
      );
    }

    // Verify user owns business
    const business = await getBusinessById(businessId);
    if (!business || !business.members[decoded.uid]) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check quota
    if (business.currentMonthUsage >= business.monthlyQuota) {
      return NextResponse.json(
        { error: "Monthly quota exceeded" },
        { status: 429 }
      );
    }

    // Get review
    const review = await getReviewById(businessId, reviewId);
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Get brand voice
    const brandVoice = await getDefaultBrandVoice(businessId);
    if (!brandVoice) {
      return NextResponse.json(
        { error: "No brand voice configured" },
        { status: 400 }
      );
    }

    // Increment usage
    const newUsage = await incrementBusinessUsage(businessId);

    // TODO: Call Cloud Function to generate reply with Claude API
    // For now, create a draft reply with placeholder
    const generatedReply = await createGeneratedReply(businessId, {
      reviewId,
      brandVoiceId: brandVoice.id,
      generatedText: `[AI Generated Reply - Rating: ${review.rating}]`,
      tokenUsage: 0,
    });

    return NextResponse.json({
      success: true,
      replyId: generatedReply.id,
      usageRemaining: business.monthlyQuota - newUsage,
    });
  } catch (error) {
    console.error("Error generating reply:", error);
    return NextResponse.json(
      { error: "Failed to generate reply" },
      { status: 500 }
    );
  }
}
