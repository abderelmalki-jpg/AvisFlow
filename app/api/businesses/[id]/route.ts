import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import { getBusinessById } from "@/lib/db/queries";
import { adminDb, FieldValue } from "@/lib/firebase/admin";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    const decoded = await verifyIdToken(token);
    const businessId = params.id;

    // Verify user owns business
    const business = await getBusinessById(businessId);
    if (!business || business.ownerId !== decoded.uid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Remove business from user's businesses array
    await adminDb
      .collection("users")
      .doc(decoded.uid)
      .update({
        businesses: FieldValue.arrayRemove(businessId),
      });

    // Delete business document
    await adminDb.collection("businesses").doc(businessId).delete();

    return NextResponse.json({
      success: true,
      message: "Business deleted",
    });
  } catch (error) {
    console.error("Error deleting business:", error);
    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}
