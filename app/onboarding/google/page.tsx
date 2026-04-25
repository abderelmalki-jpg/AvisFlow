"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { saveGoogleTokenAction } from "@/lib/actions";
import { Button } from "@/components/common/Button";

export default function GoogleConnectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get("token");
      const googleToken = searchParams.get("googleToken");
      const googleRefreshToken = searchParams.get("googleRefreshToken");

      if (token && googleToken) {
        try {
          setLoading(true);
          const businessId = localStorage.getItem("onboardingBusinessId");
          if (!businessId) {
            setError("Business not found");
            return;
          }

          const result = await saveGoogleTokenAction(
            token,
            businessId,
            googleToken,
            googleRefreshToken || undefined
          );

          if (result.success) {
            setConnected(true);
            setError(null);
          } else {
            setError(result.error || "Failed to save Google token");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    handleGoogleCallback();
  }, [searchParams]);

  const handleGoogleConnect = async () => {
    try {
      const response = await fetch("/api/auth/google");
      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (err) {
      setError("Failed to initiate Google connection");
    }
  };

  const handleContinue = () => {
    router.push("/onboarding/voice");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Connect Google Business Profile
        </h2>
        <p className="mt-1 text-gray-600">
          We need access to your Google Business Profile to import reviews
        </p>
      </div>

      {connected ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">
            ✓ Google account connected successfully
          </p>
        </div>
      ) : (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            You'll be redirected to Google to authorize access to your business
            profile
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!connected ? (
        <Button
          onClick={handleGoogleConnect}
          size="lg"
          loading={loading}
          className="w-full"
        >
          Connect Google Account
        </Button>
      ) : (
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full"
        >
          Continue to Brand Voice Setup
        </Button>
      )}

      <p className="text-center text-xs text-gray-500">
        {connected
          ? "You can disconnect later in settings"
          : "We don't store your Google password"}
      </p>
    </div>
  );
}
