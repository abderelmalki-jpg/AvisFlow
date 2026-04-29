import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import { getBusinessById, getBrandVoicesByBusiness } from "@/lib/db/queries";

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

    const voices = await getBrandVoicesByBusiness(businessId);
    return NextResponse.json({ voices });
  } catch (error) {
    console.error("Error fetching brand voices:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand voices" },
      { status: 400 }
    );
  }
}
