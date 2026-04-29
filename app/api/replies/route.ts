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
    const reviewId = request.nextUrl.searchParams.get("reviewId");

    if (!businessId || !reviewId) {
      return NextResponse.json(
        { error: "Missing businessId or reviewId" },
        { status: 400 }
      );
    }

    // Verify user owns business
    const business = await getBusinessById(businessId);
    if (!business || !business.members[decoded.uid]) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Find generated reply for this review
    const snapshot = await adminDb
      .collection("businesses")
      .doc(businessId)
      .collection("generatedReplies")
      .where("reviewId", "==", reviewId)
      .limit(1)
      .get();

    const reply = snapshot.empty ? null : snapshot.docs[0].data();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error fetching reply:", error);
    return NextResponse.json(
      { error: "Failed to fetch reply" },
      { status: 400 }
    );
  }
}
