// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_OAUTH_REDIRECT_URI =
  process.env.GOOGLE_OAUTH_REDIRECT_URI ||
  "http://localhost:3000/api/auth/google/callback";

export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID || "",
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/business.manage",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID || "",
    client_secret: GOOGLE_CLIENT_SECRET || "",
    code,
    grant_type: "authorization_code",
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: params.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
  }>;
};
