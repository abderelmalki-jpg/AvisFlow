"use client";
export const dynamic = 'force-dynamic';


import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas"); return; }
    if (password.length < 6) { setError("Minimum 6 caractères"); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-fb-bg">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] bg-fb-surface border-r border-fb-border flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="text-fb-text font-semibold text-base">ReplyLocal</span>
        </div>

        <div className="space-y-6">
          {[
            { n: "01", t: "Créez votre compte", d: "Inscription gratuite, sans carte bancaire." },
            { n: "02", t: "Connectez Google Business", d: "Synchronisez vos avis en un clic." },
            { n: "03", t: "Publiez vos réponses", d: "Validez et publiez directement." },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-4">
              <span className="text-brand-500 font-mono text-sm font-bold flex-shrink-0 mt-0.5">{s.n}</span>
              <div>
                <p className="text-fb-text text-sm font-medium">{s.t}</p>
                <p className="text-fb-dim text-xs mt-0.5">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-fb-dim text-xs">© 2025 ReplyLocal</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-fb-text mb-1.5">Créer un compte</h1>
            <p className="text-fb-muted text-sm">Commencez gratuitement, sans carte bancaire</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-base" placeholder="vous@exemple.com" required />
            </div>
            <div>
              <label className="label-base">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-base" placeholder="Minimum 6 caractères" required />
            </div>
            <div>
              <label className="label-base">Confirmer le mot de passe</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-base" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>Création...</>
              ) : "Créer mon compte"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-fb-border" />
            <span className="text-xs text-fb-dim">ou</span>
            <div className="flex-1 h-px bg-fb-border" />
          </div>

          <button onClick={() => (window.location.href = "/api/auth/google")}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-fb-surface2 border border-fb-border text-fb-text text-sm font-medium rounded-lg hover:bg-fb-surface hover:border-fb-dim transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          <p className="text-center text-sm text-fb-muted mt-8">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-brand-500 font-medium hover:text-brand-400">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
