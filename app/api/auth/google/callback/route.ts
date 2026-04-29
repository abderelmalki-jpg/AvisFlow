import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/google/oauth";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getOrCreateUser } from "@/lib/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code);

    // TODO: In production, verify state parameter for CSRF protection
    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const googleUser = await userInfoResponse.json();

    // Get or create Firebase user
    const firebaseUser = await getOrCreateUser(
      googleUser.id, // Use Google ID as Firebase UID for now
      googleUser.email,
      googleUser.name
    );

    // Store Google tokens in user's business (they'll select which business during onboarding)
    // For now, just return the tokens to the client
    const customToken = await adminAuth.createCustomToken(firebaseUser.id);

    // Try to get Google Account ID from Google Business API
    let googleAccountId = undefined;
    try {
      const { googleBusinessApi } = await import("@/lib/google/api");
      const accountsResponse = await googleBusinessApi.getAccounts(
        tokens.access_token
      );
      if (accountsResponse.accounts && accountsResponse.accounts.length > 0) {
        // Extract account ID from accounts/123456 format
        const accountName = accountsResponse.accounts[0].name;
        googleAccountId = accountName.split("/")[1];
      }
    } catch (error) {
      console.warn("Could not fetch Google Account ID:", error);
    }

    // Redirect back to onboarding with Google tokens
    const redirectUrl = new URL("/onboarding/google", request.nextUrl.origin);
    redirectUrl.searchParams.set("token", customToken);
    redirectUrl.searchParams.set("googleToken", tokens.access_token);
    if (tokens.refresh_token) {
      redirectUrl.searchParams.set("googleRefreshToken", tokens.refresh_token);
    }
    if (googleAccountId) {
      redirectUrl.searchParams.set("googleAccountId", googleAccountId);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    const errorUrl = new URL("/auth/login", request.nextUrl.origin);
    errorUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(errorUrl);
  }
}
