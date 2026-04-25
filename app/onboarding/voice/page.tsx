"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { createBrandVoiceAction } from "@/lib/actions";
import { Button } from "@/components/common/Button";

const VOICE_TEMPLATES = [
  {
    id: "friendly",
    name: "Friendly & Casual",
    description: "Warm, approachable, uses casual language and emojis",
    systemPromptSegment:
      "Use a warm, friendly tone with casual language. You can include emojis. Thank customers personally by name if possible.",
  },
  {
    id: "professional",
    name: "Professional & Formal",
    description: "Polished, business-like, emphasizes quality and reliability",
    systemPromptSegment:
      "Use a professional, formal tone. Focus on quality, reliability, and business value. Avoid slang and emojis.",
  },
  {
    id: "grateful",
    name: "Grateful & Appreciative",
    description: "Emphasizes gratitude, builds loyalty, personal touch",
    systemPromptSegment:
      "Express genuine gratitude for the review. Make the customer feel valued. Emphasize your commitment to their satisfaction.",
  },
];

export default function BrandVoicePage() {
  const router = useRouter();
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("friendly");

  const handleSelect = async (templateId: string) => {
    setLoading(true);
    setError(null);

    try {
      const template = VOICE_TEMPLATES.find((t) => t.id === templateId);
      if (!template) {
        setError("Template not found");
        return;
      }

      const businessId = localStorage.getItem("onboardingBusinessId");
      if (!businessId) {
        setError("Business not found");
        return;
      }

      const token = await getIdToken();
      if (!token) {
        setError("Authentication failed");
        return;
      }

      const result = await createBrandVoiceAction(token, businessId, {
        name: template.name,
        description: template.description,
        examples: [
          {
            review:
              "Best pizza in town! Service was quick and staff was friendly.",
            replyTemplate:
              "Thanks so much for the kind words! We love hearing that our team made your experience great. Come back soon! 🍕",
          },
          {
            review: "Food was cold and arrived late.",
            replyTemplate:
              "We're really sorry to hear this. That's not the experience we strive for. Please give us another chance - we'd like to make it right.",
          },
        ],
        systemPromptSegment: template.systemPromptSegment,
      });

      if (result.success) {
        // Clear localStorage and redirect to dashboard
        localStorage.removeItem("onboardingBusinessId");
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to create brand voice");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Choose your brand voice
        </h2>
        <p className="mt-1 text-gray-600">
          How should ReplyLocal respond to reviews?
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {VOICE_TEMPLATES.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedTemplate === template.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{template.description}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={() => handleSelect(selectedTemplate)}
        size="lg"
        loading={loading}
        className="w-full"
      >
        Complete Onboarding
      </Button>

      <p className="text-center text-xs text-gray-500">
        You can change your brand voice anytime in settings
      </p>
    </div>
  );
}
