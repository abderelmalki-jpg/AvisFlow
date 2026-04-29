import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/utils/auth";
import { createBusiness } from "@/lib/db/mutations";

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
    const { name, industry } = await request.json();

    if (!name || !industry) {
      return NextResponse.json(
        { error: "Missing name or industry" },
        { status: 400 }
      );
    }

    const business = await createBusiness(decoded.uid, {
      name,
      industry,
    });

    return NextResponse.json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
