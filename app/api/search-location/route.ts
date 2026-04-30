import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

interface PlaceSearchResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
}

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: "Google Places API key not configured" },
        { status: 500 }
      );
    }

    const { businessName, city } = await request.json();

    if (!businessName || !city) {
      return NextResponse.json(
        { error: "Business name and city are required" },
        { status: 400 }
      );
    }

    const searchQuery = `${businessName} ${city}`;

    // Call Google Places API Text Search (GET request)
    const params = new URLSearchParams({
      query: searchQuery,
      key: GOOGLE_PLACES_API_KEY,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places API error:", {
        status: data.status,
        errorMessage: data.error_message,
        query: searchQuery,
      });

      if (data.status === "REQUEST_DENIED") {
        return NextResponse.json(
          {
            error: "Clé API Google Places invalide ou non configurée. Vérifie que Places API est activée et que la clé est correcte."
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: `Google Places API error: ${data.status}` },
        { status: 400 }
      );
    }

    interface GooglePlace {
      place_id: string;
      name: string;
      formatted_address: string;
      rating?: number;
    }

    // Transform results
    const results: PlaceSearchResult[] = (data.results || [])
      .slice(0, 10)
      .map((place: GooglePlace) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search location error:", error);
    return NextResponse.json(
      { error: "Failed to search locations" },
      { status: 500 }
    );
  }
}
