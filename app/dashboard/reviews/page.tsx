"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useBusinesses } from "@/hooks/useBusinesses";
import { Review } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400" : "text-fb-border"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    replied: "bg-green-400/10 text-green-400 border-green-400/20",
    archived: "bg-fb-surface2 text-fb-muted border-fb-border",
  };
  const labels: Record<string, string> = { pending: "En attente", replied: "Répondu", archived: "Archivé" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] || map.archived}`}>
      {labels[status] || status}
    </span>
  );
}

export default function ReviewsPage() {
  const { getIdToken } = useAuth();
  const { businesses } = useBusinesses();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!businesses?.length) { setLoading(false); return; }
        const token = await getIdToken();
        if (!token) { setError("Non authentifié"); return; }
        const res = await fetch(`/api/reviews?businessId=${businesses[0].id}&status=pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Impossible de charger les avis");
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); }
      finally { setLoading(false); }
    })();
  }, [businesses, getIdToken]);

  const handleSync = async () => {
    setSyncing(true); setError(null);
    try {
      const token = await getIdToken();
      if (!token || !businesses?.length) return;
      const res = await fetch("/api/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ businessId: businesses[0].id }),
      });
      if (!res.ok) throw new Error("Synchronisation impossible");
      location.reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); }
    finally { setSyncing(false); }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fb-text">Avis</h1>
          <p className="text-fb-muted text-sm mt-1">Gérez et répondez à vos avis Google</p>
        </div>
        <button onClick={handleSync} disabled={syncing || !businesses?.length}
          className="inline-flex items-center gap-2 px-4 py-2 bg-fb-surface border border-fb-border text-fb-text text-sm font-medium rounded-lg hover:bg-fb-surface2 disabled:opacity-50 transition-colors">
          <svg className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {syncing ? "Synchronisation..." : "Synchroniser"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-fb-surface rounded-xl border border-fb-border shadow-card overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <svg className="animate-spin h-6 w-6 text-brand-500 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-fb-muted text-sm">Chargement des avis...</p>
          </div>
        ) : !businesses?.length ? (
          <div className="px-6 py-12 text-center">
            <p className="text-fb-muted text-sm">Aucune entreprise configurée.</p>
            <Link href="/onboarding" className="text-brand-500 text-sm hover:text-brand-400 mt-1 inline-block">Configurer →</Link>
          </div>
        ) : reviews.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-12 h-12 bg-fb-surface2 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-fb-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-fb-text text-sm font-medium mb-1">Aucun avis en attente</p>
            <p className="text-fb-dim text-xs">Cliquez sur &quot;Synchroniser&quot; pour importer vos avis Google.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fb-border bg-fb-surface2">
                <th className="px-6 py-3 text-left text-xs font-semibold text-fb-dim uppercase tracking-wide">Auteur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-fb-dim uppercase tracking-wide">Note</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-fb-dim uppercase tracking-wide">Avis</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-fb-dim uppercase tracking-wide">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-fb-dim uppercase tracking-wide">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-fb-border">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-fb-surface2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {(r.googleAuthorName || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-fb-text text-sm">{r.googleAuthorName || "Anonyme"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Stars rating={r.rating} /></td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-fb-muted text-sm truncate">{r.text || "—"}</p>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-4 text-fb-dim text-xs whitespace-nowrap">
                    {new Date(r.createdAt instanceof Date ? r.createdAt : (typeof r.createdAt === 'object' && r.createdAt !== null && 'toDate' in r.createdAt && typeof r.createdAt.toDate === 'function') ? r.createdAt.toDate() : r.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/reviews/${r.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition-colors">
                      Répondre
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
