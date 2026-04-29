"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Business } from "@/lib/types";

export function useBusinesses() {
  const { getIdToken } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = await getIdToken();
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch("/api/businesses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch businesses");
        }

        const data = await response.json();
        setBusinesses(data.businesses || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [getIdToken]);

  return { businesses, loading, error };
}
