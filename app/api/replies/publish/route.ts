import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import { getBusinessById, getGeneratedReplyById } from "@/lib/db/queries";
import { updateReplyStatus, updateReviewStatus } from "@/lib/db/mutations";

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
    const { businessId, replyId, finalText } = await request.json();

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

    // Update reply status to approved
    await updateReplyStatus(businessId, replyId, "approved", decoded.uid);

    // TODO: Call Cloud Function to publish to Google Business Profile
    // For now, just mark as published
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
