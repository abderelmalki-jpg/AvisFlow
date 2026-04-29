"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useBusinesses } from "@/hooks/useBusinesses";
import { Location } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function LocationsSettingsPage() {
  const { getIdToken } = useAuth();
  const { businesses } = useBusinesses();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        if (!businesses || businesses.length === 0) {
          setLocations([]);
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
          `/api/locations?businessId=${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data = await response.json();
        setLocations(data.locations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [businesses, getIdToken]);

  if (loading) {
    return <div>Loading locations...</div>;
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Locations</h1>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Locations</h1>

      {error && (
        <Card className="mb-6">
          <CardBody>
            <p className="text-red-600">{error}</p>
          </CardBody>
        </Card>
      )}

      <div className="mb-6">
        <Button href="/dashboard/settings/locations/create" variant="primary">
          Add Location
        </Button>
      </div>

      {locations.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-gray-600 text-center py-8">
              No locations added yet. Add your first location to start managing reviews.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {location.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{location.address}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {location.reviewCount} reviews
                    </p>
                  </div>
                  <div className="ml-4 space-x-2">
                    <Button href={`/dashboard/settings/locations/${location.id}`} variant="secondary" size="sm">
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
