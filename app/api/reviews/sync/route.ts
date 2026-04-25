import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import { getBusinessById } from "@/lib/db/queries";

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

    // TODO: Call Cloud Function to sync reviews
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Review sync initiated",
      jobId: `sync-${Date.now()}`,
    });
  } catch (error) {
    console.error("Error syncing reviews:", error);
    return NextResponse.json(
      { error: "Failed to sync reviews" },
      { status: 500 }
    );
  }
}
