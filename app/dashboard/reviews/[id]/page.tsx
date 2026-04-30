"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useBusinesses } from "@/hooks/useBusinesses";
import { Review, GeneratedReply } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-5 h-5 ${s <= rating ? "text-amber-400" : "text-fb-border"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-fb-muted ml-1">{rating}/5</span>
    </div>
  );
}

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: reviewId } = use(params);
  const { getIdToken } = useAuth();
  const { businesses } = useBusinesses();
  const [review, setReview] = useState<Review | null>(null);
  const [reply, setReply] = useState<GeneratedReply | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!businesses?.length) { setError("Aucune entreprise"); setLoading(false); return; }
        const token = await getIdToken();
        if (!token) { setError("Non authentifié"); return; }
        const bid = businesses[0].id;
        const [rr, pr] = await Promise.all([
          fetch(`/api/reviews/${reviewId}?businessId=${bid}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/replies?businessId=${bid}&reviewId=${reviewId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!rr.ok) throw new Error("Avis introuvable");
        const rd = await rr.json(); setReview(rd.review);
        if (pr.ok) {
          const pd = await pr.json();
          if (pd.reply) { setReply(pd.reply); setReplyText(pd.reply.generatedText || ""); }
        }
      } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); }
      finally { setLoading(false); }
    })();
  }, [businesses, getIdToken, reviewId]);

  const handleGenerate = async () => {
    setGenerating(true); setError(null);
    try {
      const token = await getIdToken();
      if (!token || !review || !businesses?.length) return;
      const res = await fetch("/api/replies/generate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: businesses[0].id, reviewId: review.id }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Échec"); }
      const d = await res.json(); setReply(d.reply); setReplyText(d.reply.generatedText);
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); }
    finally { setGenerating(false); }
  };

  const handlePublish = async () => {
    setPublishing(true); setError(null);
    try {
      const token = await getIdToken();
      if (!token || !reply || !businesses?.length) return;
      const res = await fetch("/api/replies/publish", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: businesses[0].id, replyId: reply.id, editedText: replyText }),
      });
      if (!res.ok) throw new Error("Échec publication");
      setReply((p) => p ? { ...p, status: "published" } : null); setIsEditing(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); }
    finally { setPublishing(false); }
  };

  const fmt = (d: any) => {
    const date = d instanceof Date ? d : d?.toDate?.() ?? new Date(d);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) return (
    <div className="max-w-5xl space-y-6">
      <div className="h-5 w-32 bg-fb-surface2 rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-6">
        {[1,2].map(i => <div key={i} className="h-72 bg-fb-surface rounded-xl animate-pulse" />)}
      </div>
    </div>
  );

  if (!review) return (
    <div className="max-w-5xl">
      <Link href="/dashboard/reviews" className="inline-flex items-center gap-1.5 text-sm text-fb-muted hover:text-fb-text mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Retour
      </Link>
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
        <p className="text-red-400 text-sm">{error || "Avis non trouvé"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link href="/dashboard/reviews" className="inline-flex items-center gap-1.5 text-sm text-fb-muted hover:text-fb-text mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Retour aux avis
        </Link>
        <h1 className="text-2xl font-bold text-fb-text">Répondre à l'avis</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review card */}
        <div className="bg-fb-surface rounded-xl border border-fb-border shadow-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fb-dim uppercase tracking-wide">Avis client</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
              review.status === "pending" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
              review.status === "replied" ? "bg-green-400/10 text-green-400 border-green-400/20" :
              "bg-fb-surface2 text-fb-muted border-fb-border"
            }`}>
              {review.status === "pending" ? "En attente" : review.status === "replied" ? "Répondu" : "Archivé"}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0 font-bold text-sm">
              {(review.googleAuthorName || "?").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-fb-text text-sm">{review.googleAuthorName || "Anonyme"}</p>
              <p className="text-xs text-fb-dim mt-0.5">{fmt(review.createdAt)}</p>
            </div>
          </div>
          <Stars rating={review.rating} />
          <div className="bg-fb-surface2 rounded-lg p-4 border border-fb-border">
            <p className="text-fb-text text-sm leading-relaxed">{review.text || <span className="text-fb-dim italic">Pas de texte</span>}</p>
          </div>
        </div>

        {/* Reply card */}
        <div className="bg-fb-surface rounded-xl border border-fb-border shadow-card p-6 space-y-5">
          <span className="text-xs font-semibold text-fb-dim uppercase tracking-wide">Votre réponse</span>

          {!reply ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-fb-text text-sm font-medium mb-1">Aucune réponse générée</p>
              <p className="text-fb-dim text-xs mb-5">Générez une réponse IA personnalisée en un clic</p>
              <button onClick={handleGenerate} disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors">
                {generating ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Génération...</>
                ) : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Générer avec l'IA</>}
              </button>
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                className="input-base resize-none" rows={8} />
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-fb-surface2 border border-fb-border text-fb-text text-sm font-medium rounded-lg hover:bg-fb-surface transition-colors">
                  Annuler
                </button>
                <button onClick={handlePublish} disabled={publishing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {publishing ? "Publication..." : "Publier"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {reply.status === "published" && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Réponse publiée sur Google
                </div>
              )}
              <div className="bg-brand-500/5 rounded-lg p-4 border border-brand-500/20">
                <p className="text-fb-text text-sm leading-relaxed">{replyText}</p>
              </div>
              {reply.status !== "published" && (
                <div className="flex gap-3">
                  <button onClick={handleGenerate} disabled={generating}
                    className="flex-1 px-4 py-2 bg-fb-surface2 border border-fb-border text-fb-text text-sm font-medium rounded-lg hover:bg-fb-surface disabled:opacity-50 transition-colors">
                    {generating ? "..." : "Régénérer"}
                  </button>
                  <button onClick={() => setIsEditing(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    Modifier et publier
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
