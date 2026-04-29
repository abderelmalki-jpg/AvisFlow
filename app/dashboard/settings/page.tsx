"use client";

import { useState } from "react";
import Link from "next/link";

const sections = [
  {
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    title: "Google Business Profile",
    desc: "Connectez votre compte Google pour synchroniser automatiquement vos avis.",
    action: { label: "Connecter Google", type: "button" as const, id: "google" },
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
    title: "Voix de marque",
    desc: "Définissez le ton et le style de vos réponses pour qu'elles reflètent votre identité.",
    action: { label: "Configurer", type: "link" as const, href: "/dashboard/settings/voice" },
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    title: "Emplacements",
    desc: "Ajoutez et gérez vos établissements pour centraliser tous vos avis.",
    action: { label: "Gérer", type: "link" as const, href: "/dashboard/settings/locations" },
    color: "bg-green-500/10 text-green-400",
  },
  {
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    title: "Facturation",
    desc: "Consultez votre abonnement, votre quota mensuel et vos factures.",
    action: { label: "Voir la facturation", type: "link" as const, href: "/dashboard/settings/billing" },
    color: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    title: "Équipe",
    desc: "Invitez des collaborateurs à gérer les avis avec vous.",
    action: { label: "Gérer l'équipe", type: "link" as const, href: "/dashboard/settings/team" },
    color: "bg-fb-surface2 text-fb-muted",
  },
];

export default function SettingsPage() {
  const [connecting, setConnecting] = useState(false);

  const handleConnectGoogle = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/auth/google");
      const { authUrl } = await res.json();
      window.location.href = authUrl;
    } catch {
      alert("Erreur lors de la connexion à Google");
      setConnecting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fb-text">Paramètres</h1>
        <p className="text-fb-muted text-sm mt-1">Configurez votre compte et vos intégrations</p>
      </div>

      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.title}
            className="bg-fb-surface rounded-xl border border-fb-border shadow-card px-6 py-5 flex items-center justify-between gap-6 hover:border-fb-dim transition-colors">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-fb-text">{s.title}</p>
                <p className="text-xs text-fb-muted mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              {s.action.type === "button" ? (
                <button onClick={handleConnectGoogle} disabled={connecting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors whitespace-nowrap">
                  {connecting ? "Connexion..." : s.action.label}
                </button>
              ) : (
                <Link href={s.action.href!}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-fb-surface2 border border-fb-border text-fb-text text-sm font-medium rounded-lg hover:bg-fb-surface hover:border-fb-dim transition-colors whitespace-nowrap">
                  {s.action.label}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
