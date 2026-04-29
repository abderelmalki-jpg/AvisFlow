"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { createBrandVoiceAction } from "@/lib/actions";

const VOICE_TEMPLATES = [
  {
    id: "friendly",
    name: "Amical et Casual",
    description: "Chaleureux, accessible, langage détendu avec des emojis occasionnels",
    icon: "😊",
    systemPromptSegment: "Utilisez un ton chaleureux et amical avec un langage casual. Vous pouvez inclure des emojis. Remerciez les clients personnellement par leur nom si possible.",
  },
  {
    id: "professional",
    name: "Professionnel et Formel",
    description: "Élégant, soigné, met l'accent sur la qualité et la fiabilité",
    icon: "💼",
    systemPromptSegment: "Utilisez un ton professionnel et formel. Mettez l'accent sur la qualité, la fiabilité et la valeur commerciale. Évitez l'argot et les emojis.",
  },
  {
    id: "grateful",
    name: "Reconnaissant et Appréciatif",
    description: "Met l'accent sur la gratitude, renforce la fidélité, touche personnel",
    icon: "🙏",
    systemPromptSegment: "Exprimez une véritable gratitude pour l'avis. Faites sentir aux clients qu'ils sont valorisés. Mettez l'accent sur votre engagement envers leur satisfaction.",
  },
];

export default function BrandVoicePage() {
  const router = useRouter();
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("friendly");

  const handleSelect = async () => {
    setLoading(true);
    setError(null);
    try {
      const template = VOICE_TEMPLATES.find((t) => t.id === selectedTemplate);
      if (!template) return;
      const businessId = localStorage.getItem("onboardingBusinessId");
      if (!businessId) { setError("Entreprise introuvable"); return; }
      const token = await getIdToken();
      if (!token) { setError("Session expirée"); return; }
      const result = await createBrandVoiceAction(token, businessId, {
        name: template.name,
        description: template.description,
        examples: [
          { review: "Super expérience, personnel accueillant !", replyTemplate: "Merci beaucoup ! C'est un plaisir de vous avoir accueilli 😊" },
          { review: "Commande en retard et froide.", replyTemplate: "Nous sommes vraiment désolés pour cette expérience. Ce n'est pas notre standard et nous aimerions rectifier cela." },
        ],
        systemPromptSegment: template.systemPromptSegment,
      });
      if (result.success) {
        localStorage.removeItem("onboardingBusinessId");
        router.push("/dashboard");
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
        <h2 className="text-xl font-bold text-fb-text">Voix de marque</h2>
        <p className="text-fb-muted text-sm mt-1">Quel ton souhaitez-vous pour vos réponses ?</p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        {VOICE_TEMPLATES.map((t) => {
          const selected = selectedTemplate === t.id;
          return (
            <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors flex items-start gap-4 ${
                selected ? "border-brand-500 bg-brand-500/5" : "border-fb-border bg-fb-surface2 hover:border-fb-dim"
              }`}>
              <span className="text-2xl flex-shrink-0">{t.icon}</span>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${selected ? "text-fb-text" : "text-fb-text"}`}>{t.name}</p>
                <p className="text-fb-muted text-xs mt-0.5">{t.description}</p>
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
          );
        })}
      </div>

      <button onClick={handleSelect} disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50">
        {loading ? (
          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Finalisation...</>
        ) : <>Terminer la configuration<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>}
      </button>

      <p className="text-center text-xs text-fb-dim">Modifiable à tout moment dans les paramètres</p>
    </div>
  );
}
