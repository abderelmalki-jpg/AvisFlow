"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useBusinesses } from "@/hooks/useBusinesses";

interface HistoryItem { id: string; author: string; reviewText: string; replyText: string; date: string; rating: number; }

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

export default function HistoryPage() {
  const { getIdToken } = useAuth();
  const { businesses } = useBusinesses();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!businesses?.length) { setLoading(false); return; }
        const token = await getIdToken();
        if (!token) { setError("Non authentifié"); return; }
        const res = await fetch(`/api/history?businessId=${businesses[0].id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Impossible de charger l'historique");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); }
      finally { setLoading(false); }
    })();
  }, [businesses, getIdToken]);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fb-text">Historique</h1>
        <p className="text-fb-muted text-sm mt-1">Toutes vos réponses publiées</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-fb-surface rounded-xl border border-fb-border shadow-card overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <svg className="animate-spin h-6 w-6 text-brand-500 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className="text-fb-muted text-sm">Chargement...</p>
          </div>
        ) : !businesses?.length ? (
          <div className="px-6 py-12 text-center"><p className="text-fb-muted text-sm">Aucune entreprise configurée.</p></div>
        ) : history.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-12 h-12 bg-fb-surface2 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-fb-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-fb-text text-sm font-medium mb-1">Aucune réponse publiée</p>
            <p className="text-fb-dim text-xs">Vos réponses publiées apparaîtront ici.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fb-border bg-fb-surface2">
                {["Auteur","Note","Avis","Réponse","Date"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-fb-dim uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-fb-border">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-fb-surface2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center text-xs font-bold">
                        {item.author.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-fb-text text-sm">{item.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Stars rating={item.rating} /></td>
                  <td className="px-6 py-4 max-w-[180px]"><p className="text-fb-muted text-xs truncate italic">&quot;{item.reviewText}&quot;</p></td>
                  <td className="px-6 py-4 max-w-[180px]"><p className="text-fb-muted text-xs truncate">&quot;{item.replyText}&quot;</p></td>
                  <td className="px-6 py-4 text-fb-dim text-xs whitespace-nowrap">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
