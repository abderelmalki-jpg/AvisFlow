"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { saveGoogleTokenAction } from "@/lib/actions";

export default function GoogleConnectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const googleToken = searchParams.get("googleToken");
      const googleRefreshToken = searchParams.get("googleRefreshToken");
      const googleAccountId = searchParams.get("googleAccountId");
      if (token && googleToken) {
        try {
          setLoading(true);
          const businessId = localStorage.getItem("onboardingBusinessId");
          if (!businessId) { setError("Entreprise introuvable"); return; }
          const result = await saveGoogleTokenAction(token, businessId, googleToken, googleRefreshToken || undefined, googleAccountId || undefined);
          if (result.success) { setConnected(true); }
          else { setError(result.error || "Échec de la connexion"); }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erreur");
        } finally {
          setLoading(false);
        }
      }
    };
    handleCallback();
  }, [searchParams]);

  const handleConnect = async () => {
    try {
      const res = await fetch("/api/auth/google");
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch {
      setError("Impossible d'initier la connexion Google");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-fb-text">Connectez Google Business</h2>
        <p className="text-fb-muted text-sm mt-1">Autorisez l'accès à votre profil Google Business Profile pour importer les avis</p>
      </div>

      {connected ? (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-green-400 text-sm font-medium">Compte Google connecté avec succès</p>
        </div>
      ) : (
        <div className="p-4 bg-fb-surface2 border border-fb-border rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-fb-muted flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-fb-muted text-sm">Vous serez redirigé vers Google pour autoriser l'accès. Nous ne stockons pas votre mot de passe.</p>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!connected ? (
        <div className="space-y-3">
          <button onClick={handleConnect} disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-fb-surface2 border border-fb-border text-fb-text text-sm font-medium rounded-lg hover:bg-fb-surface hover:border-fb-dim transition-colors disabled:opacity-50">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Connexion..." : "Connecter avec Google"}
          </button>
          <button onClick={() => router.push("/onboarding/voice")}
            className="w-full px-4 py-2 text-fb-dim text-sm hover:text-fb-muted transition-colors">
            Passer cette étape →
          </button>
        </div>
      ) : (
        <button onClick={() => router.push("/onboarding/voice")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors">
          Continuer
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>
      )}
    </div>
  );
}
