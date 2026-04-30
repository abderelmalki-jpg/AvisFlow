"use client";

import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Réponses IA instantanées",
    desc: "Générez des réponses personnalisées qui correspondent au ton de votre marque en un clic.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Validation humaine",
    desc: "Relisez et modifiez chaque réponse avant publication. Vous gardez le contrôle.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Multi-établissements",
    desc: "Gérez tous vos établissements depuis un tableau de bord unique.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-fb-bg">
      {/* Header */}
      <header className="w-full border-b border-fb-border bg-fb-bg/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-0 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-fb-text font-semibold text-sm">ReplyLocal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-fb-muted hover:text-fb-text transition-colors">
              Se connecter
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium px-4 py-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 text-brand-400 text-xs font-medium rounded-full mb-8 border border-brand-500/20">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            Propulsé par l&apos;IA · Gemini
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-fb-text leading-tight mb-6">
            Répondez à chaque avis Google
            <br />
            <span className="text-brand-500">en secondes</span>
          </h1>

          <p className="text-lg text-fb-muted max-w-xl mx-auto mb-10 leading-relaxed">
            ReplyLocal génère des réponses personnalisées alignées avec votre marque.
            Économisez du temps, maintenez la cohérence, renforcez votre réputation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-sm text-base"
            >
              Commencer gratuitement
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-fb-surface text-fb-text font-semibold rounded-xl border border-fb-border hover:bg-fb-surface2 transition-colors text-base"
            >
              Se connecter
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 bg-fb-surface rounded-2xl border border-fb-border shadow-card hover:border-brand-500/30 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-500/10 text-brand-500 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-fb-text mb-2">{f.title}</h3>
                <p className="text-sm text-fb-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-fb-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-sm text-fb-dim">© 2025 ReplyLocal</span>
          <span className="text-sm text-fb-dim">Tous droits réservés</span>
        </div>
      </footer>
    </div>
  );
}
