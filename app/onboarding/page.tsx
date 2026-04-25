"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { createBusinessAction } from "@/lib/actions";
import { Button } from "@/components/common/Button";

export default function OnboardingPage() {
  const router = useRouter();
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "restaurant",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) {
        setError("Authentication failed");
        return;
      }

      const result = await createBusinessAction(token, formData);

      if (result.success && result.data) {
        // Store businessId in localStorage for next step
        localStorage.setItem("onboardingBusinessId", result.data.id);
        router.push("/onboarding/location");
      } else {
        setError(result.error || "Failed to create business");
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
          Let's get started
        </h2>
        <p className="mt-1 text-gray-600">
          First, tell us about your business
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Joe's Pizza"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <select
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="restaurant">Restaurant</option>
            <option value="salon">Salon/Spa</option>
            <option value="auto">Auto Repair</option>
            <option value="retail">Retail</option>
            <option value="service">Service Business</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Continue to Next Step
        </Button>
      </form>

      <p className="text-center text-xs text-gray-500">
        You can add more locations later
      </p>
    </div>
  );
}
