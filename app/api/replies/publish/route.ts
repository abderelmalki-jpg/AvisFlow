import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import {
  getBusinessById,
  getGeneratedReplyById,
  getReviewById,
} from "@/lib/db/queries";
import { updateReplyStatus, updateReviewStatus } from "@/lib/db/mutations";
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
    const { businessId, replyId, editedText } = await request.json();

    if (!businessId || !replyId) {
      return NextResponse.json(
        { error: "Missing businessId or replyId" },
        { status: 400 }
      );
    }

    // Verify user owns/is in business
    const business = await getBusinessById(businessId);
    if (!business || !business.members[decoded.uid]) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get generated reply
    const reply = await getGeneratedReplyById(businessId, replyId);
    if (!reply) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    // Get review to find Google review ID
    const review = await getReviewById(businessId, reply.reviewId);
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Update reply status to approved
    await updateReplyStatus(businessId, replyId, "approved", decoded.uid);

    // Publish to Google Business Profile
    const replyText = editedText || reply.generatedText;
    try {
      if (business.googleAccessToken && business.googleAccountId) {
        const reviewName = `accounts/${business.googleAccountId}/reviews/${review.googleReviewId}`;
        await googleBusinessApi.publishReply(
          reviewName,
          replyText,
          business.googleAccessToken
        );
      }
    } catch (error) {
      console.error("Error publishing to Google Business Profile:", error);
    }

    await updateReplyStatus(businessId, replyId, "published");
    await updateReviewStatus(businessId, reply.reviewId, "replied");

    return NextResponse.json({
      success: true,
      message: "Reply published successfully",
    });
  } catch (error) {
    console.error("Error publishing reply:", error);
    return NextResponse.json(
      { error: "Failed to publish reply" },
      { status: 500 }
    );
  }
}
