"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useBusinesses } from "@/hooks/useBusinesses";
import { BrandVoice } from "@/lib/types";
import { Card, CardBody } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function VoiceSettingsPage() {
  const { getIdToken } = useAuth();
  const { businesses } = useBusinesses();
  const [voices, setVoices] = useState<BrandVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        if (!businesses || businesses.length === 0) {
          setVoices([]);
          setLoading(false);
          return;
        }

        const token = await getIdToken();
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const businessId = businesses[0].id;
        const response = await fetch(
          `/api/brand-voices?businessId=${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch brand voices");
        }

        const data = await response.json();
        setVoices(data.voices || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch brand voices");
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [businesses, getIdToken]);

  if (loading) {
    return <div>Loading brand voices...</div>;
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Brand Voice</h1>
        <Card>
          <CardBody>
            <p className="text-gray-600">
              No businesses found. Please set up your business first.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Brand Voice</h1>

      {error && (
        <Card className="mb-6">
          <CardBody>
            <p className="text-red-600">{error}</p>
          </CardBody>
        </Card>
      )}

      <div className="mb-6">
        <Button href="/dashboard/settings/voice/create" variant="primary">
          Create New Brand Voice
        </Button>
      </div>

      {voices.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-gray-600 text-center py-8">
              No brand voices created yet. Create one to customize your AI reply style.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {voices.map((voice) => (
            <Card key={voice.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {voice.name}
                      {voice.isDefault && (
                        <span className="ml-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          Default
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 mt-1">{voice.description}</p>
                  </div>
                  <div className="ml-4 space-x-2">
                    <Button href={`/dashboard/settings/voice/${voice.id}`} variant="secondary" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
