import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google/oauth";

export async function GET(request: NextRequest) {
  try {
    const authUrl = getGoogleAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error generating Google auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
