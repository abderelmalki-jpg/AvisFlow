"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/contexts/AuthContext";

const steps = [
  { n: 1, label: "Entreprise" },
  { n: 2, label: "Emplacement" },
  { n: 3, label: "Google" },
  { n: 4, label: "Voix" },
];

function getStep(pathname: string) {
  if (pathname.includes("/voice")) return 4;
  if (pathname.includes("/google")) return 3;
  if (pathname.includes("/location")) return 2;
  return 1;
}

function OnboardingContent({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = getStep(pathname);

  useEffect(() => {
    if (!loading && !firebaseUser) router.push("/auth/login");
  }, [firebaseUser, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-fb-bg">
      <svg className="animate-spin h-6 w-6 text-brand-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  if (!firebaseUser) return null;

  return (
    <div className="min-h-screen bg-fb-bg flex flex-col">
      {/* Header */}
      <header className="bg-fb-surface border-b border-fb-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </div>
            <span className="text-fb-text font-semibold text-sm">ReplyLocal</span>
          </div>
          <span className="text-sm text-fb-dim">Configuration initiale</span>
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-fb-surface border-b border-fb-border">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-fb-border -z-0" />
            {steps.map((s) => {
              const done = s.n < currentStep;
              const active = s.n === currentStep;
              return (
                <div key={s.n} className="flex flex-col items-center gap-2 bg-fb-surface z-10 px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                    done ? "bg-brand-500 border-brand-500 text-white" :
                    active ? "bg-fb-bg border-brand-500 text-brand-500" :
                    "bg-fb-bg border-fb-border text-fb-dim"
                  }`}>
                    {done ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : s.n}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${active ? "text-brand-500" : done ? "text-fb-muted" : "text-fb-dim"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-xl bg-fb-surface rounded-2xl border border-fb-border shadow-card p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingContent>{children}</OnboardingContent>
    </AuthProvider>
  );
}
