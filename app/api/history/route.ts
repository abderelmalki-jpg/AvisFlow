import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import { getBusinessById } from "@/lib/db/queries";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = await verifyIdToken(token);

    const businessId = request.nextUrl.searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json(
        { error: "Missing businessId" },
        { status: 400 }
      );
    }

    // Verify user owns business
    const business = await getBusinessById(businessId);
    if (!business || !business.members[decoded.uid]) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get published replies with their reviews
    const repliesSnapshot = await adminDb
      .collection("businesses")
      .doc(businessId)
      .collection("generatedReplies")
      .where("status", "==", "published")
      .orderBy("updatedAt", "desc")
      .limit(50)
      .get();

    const history = await Promise.all(
      repliesSnapshot.docs.map(async (replyDoc) => {
        const reply = replyDoc.data();
        // Get the review
        const reviewDoc = await adminDb
          .collection("businesses")
          .doc(businessId)
          .collection("reviews")
          .doc(reply.reviewId)
          .get();

        const review = reviewDoc.data();

        return {
          id: replyDoc.id,
          replyId: replyDoc.id,
          reviewId: reply.reviewId,
          author: review?.googleAuthorName || "Anonymous",
          reviewText: review?.text || "",
          replyText: reply.editedText || reply.generatedText,
          date: reply.updatedAt
            ? new Date(reply.updatedAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
          rating: review?.rating || 0,
        };
      })
    );

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 400 }
    );
  }
}
