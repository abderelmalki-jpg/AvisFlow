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

        // TODO: Fetch from API endpoint
        setBusinesses([]);
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
