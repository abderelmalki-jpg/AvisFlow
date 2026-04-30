"use client";

import { useState } from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";

const statCards = [
  {
    label: "Avis en attente",
    value: "0",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: "text-amber-400 bg-amber-400/10",
  },
  {
    label: "Réponses publiées",
    value: "0",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: "text-green-400 bg-green-400/10",
  },
  {
    label: "Quota mensuel",
    value: "0 / 50",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    color: "text-brand-500 bg-brand-500/10",
  },
];

export default function DashboardPage() {
  const { businesses, loading } = useBusinesses();
  const { getIdToken } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newBusiness, setNewBusiness] = useState({ name: "", industry: "" });
  const [creating, setCreating] = useState(false);

  const handleAdd = async () => {
    if (!newBusiness.name || !newBusiness.industry) return;
    setCreating(true);
    try {
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/businesses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newBusiness),
      });
      if (res.ok) { setNewBusiness({ name: "", industry: "" }); setShowForm(false); window.location.reload(); }
    } finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette entreprise ?")) return;
    const token = await getIdToken();
    if (!token) return;
    const res = await fetch(`/api/businesses/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) window.location.reload();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-52 bg-fb-surface2 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-fb-surface rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-fb-text mb-2">Aucune entreprise</h2>
        <p className="text-fb-muted text-sm mb-6">Créez votre première entreprise pour commencer à gérer vos avis.</p>
        <Link href="/onboarding"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-sm text-sm">
          Configurer mon entreprise
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fb-text">Tableau de bord</h1>
          <p className="text-fb-muted text-sm mt-1">Vue d&apos;ensemble de votre activité</p>
        </div>
        <Link href="/dashboard/reviews"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Voir les avis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-fb-surface rounded-xl border border-fb-border shadow-card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-fb-text">{s.value}</p>
              <p className="text-xs text-fb-muted mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Businesses */}
      <div className="bg-fb-surface rounded-xl border border-fb-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-fb-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-fb-text">Vos entreprises</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>

        {showForm && (
          <div className="px-6 py-4 border-b border-fb-border bg-fb-surface2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="label-base">Nom</label>
                <input type="text" placeholder="ex: Pizza de Joe" value={newBusiness.name}
                  onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                  className="input-base" />
              </div>
              <div className="flex-1">
                <label className="label-base">Secteur</label>
                <select value={newBusiness.industry}
                  onChange={(e) => setNewBusiness({ ...newBusiness, industry: e.target.value })}
                  className="input-base">
                  <option value="">Sélectionner...</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="salon">Salon/Spa</option>
                  <option value="automotive">Auto/Réparation</option>
                  <option value="retail">Commerce</option>
                  <option value="services">Services</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <button onClick={handleAdd} disabled={creating}
                className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors">
                {creating ? "..." : "Créer"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 text-fb-muted text-sm font-medium rounded-lg hover:bg-fb-surface transition-colors">
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-fb-border">
          {businesses.map((b) => (
            <div key={b.id} className="px-6 py-4 flex items-center justify-between hover:bg-fb-surface2 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-500/10 text-brand-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  {b.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-fb-text">{b.name}</p>
                  <p className="text-xs text-fb-dim mt-0.5 capitalize">{b.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  b.subscriptionStatus === "active" ? "bg-green-400/10 text-green-400 border-green-400/20" :
                  b.subscriptionStatus === "trialing" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
                  "bg-fb-surface2 text-fb-muted border-fb-border"
                }`}>
                  {b.subscriptionStatus === "trialing" ? "Essai" : b.subscriptionStatus === "active" ? "Actif" : b.subscriptionStatus}
                </span>
                <button onClick={() => handleDelete(b.id)}
                  className="p-1.5 text-fb-dim hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
