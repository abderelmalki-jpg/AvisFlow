"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { createLocationAction } from "@/lib/actions";

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
}

export default function AddLocationPage() {
  const router = useRouter();
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", city: "" });
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setError(null);
    setSearchResults([]);
    try {
      const res = await fetch("/api/search-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: formData.name, city: formData.city }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Recherche échouée");
      setSearchResults(data.results || []);
      if (!data.results?.length) setError("Aucune fiche trouvée. Vérifiez le nom et la ville.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de recherche");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPlace = async () => {
    if (!selectedPlace) return;
    setLoading(true);
    setError(null);
    try {
      const businessId = localStorage.getItem("onboardingBusinessId");
      if (!businessId) { setError("Entreprise introuvable"); return; }
      const token = await getIdToken();
      if (!token) { setError("Session expirée"); return; }
      const result = await createLocationAction(token, businessId, {
        name: selectedPlace.name,
        address: selectedPlace.address,
        placeId: selectedPlace.placeId,
      });
      if (result.success) {
        router.push("/onboarding/google");
      } else {
        setError(result.error || "Échec de la création");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-fb-text">Trouvez votre fiche Google</h2>
        <p className="text-fb-muted text-sm mt-1">Recherchez votre établissement sur Google Business Profile</p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!searchResults.length ? (
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="label-base">Nom de l&apos;établissement *</label>
            <input type="text" required value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-base" placeholder="ex: Restaurant Le Gourmet" />
          </div>
          <div>
            <label className="label-base">Ville *</label>
            <input type="text" required value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="input-base" placeholder="ex: Paris" />
          </div>
          <button type="submit" disabled={searching}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50">
            {searching ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Recherche...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>Chercher ma fiche</>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-fb-text">{searchResults.length} résultat{searchResults.length > 1 ? "s" : ""} trouvé{searchResults.length > 1 ? "s" : ""}</p>
            <button onClick={() => { setSearchResults([]); setSelectedPlace(null); setFormData({ name: "", city: "" }); }}
              className="text-xs text-brand-500 hover:text-brand-400">
              Nouvelle recherche
            </button>
          </div>

          <div className="space-y-2">
            {searchResults.map((place) => {
              const selected = selectedPlace?.placeId === place.placeId;
              return (
                <div key={place.placeId} onClick={() => setSelectedPlace(place)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selected ? "border-brand-500 bg-brand-500/5" : "border-fb-border bg-fb-surface2 hover:border-fb-dim"
                  }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-fb-text text-sm">{place.name}</p>
                      <p className="text-fb-muted text-xs mt-1">{place.address}</p>
                      {place.rating && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className="text-xs text-fb-muted">{place.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selected ? "border-brand-500 bg-brand-500" : "border-fb-border"
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleSelectPlace} disabled={!selectedPlace || loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50">
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Enregistrement...</>
            ) : <>Continuer<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>}
          </button>
        </div>
      )}
    </div>
  );
}
