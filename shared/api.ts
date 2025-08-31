/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface PingResponse {
  message: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}

// Travel planning related types for MinutePlanner
export interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  duration: string;
  description: string;
  distance: string;
  price: string;
  latitude?: number;
  longitude?: number;
}

export interface ItineraryDay {
  day: number;
  date: string;
  places: Place[];
  total_duration: string;
}

export interface TripPreferences {
  destination: string;
  duration: string;
  travelers: number;
  interests: string[];
  pace: 'relaxed' | 'moderate' | 'packed';
  budget: 'budget' | 'moderate' | 'premium';
  special_requirements?: string;
}

export interface ItineraryRequest {
  preferences: TripPreferences;
  selected_places?: string[];
}

export interface ItineraryResponse {
  id: string;
  name: string;
  destination: string;
  duration: string;
  travelers: number;
  days: ItineraryDay[];
  total_cost_estimate?: string;
  optimization_score?: number;
  ai_enhanced?: boolean;
}

// Hugging Face API types
export interface PreferencesParseRequest {
  text: string;
}

export interface PreferencesParseResponse {
  preferences: TripPreferences;
  sentiment: {
    sentiment: string;
    confidence: number;
  };
  locations: Array<{
    location: string;
    confidence: number;
  }>;
  original_text: string;
}

// API utility functions
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}\n${errorText}`,
      response.status,
      response
    );
  }

  return response.json();
}

const MAPTILER_KEY = import.meta.env.VITE_MAPLIBRE_API_KEY;

export async function geocodeLocation(location: string): Promise<{ lat: number; lng: number }> {
const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${MAPTILER_KEY}`;
const res = await fetch(url);
if (!res.ok) {
throw new Error(`Geocoding failed: ${res.statusText}`);
}
const data = await res.json();
if (!data.features || data.features.length === 0) {
throw new Error(`No results for location: ${location}`);
}
const [lng, lat] = data.features[0].center;
return { lat, lng };
}

// API functions for MinutePlanner
export const PlacesApi = {
// Long-term correct: use backend contract ll=lat,lng
searchPlaces: async (params: {
location: string;
query?: string;
categories?: string;
radius?: number;
limit?: number;
}): Promise<Place[]> => {
const { lat, lng } = await geocodeLocation(params.location);
const searchParams = new URLSearchParams();
searchParams.append('ll', `${lat},${lng}`);
if (params.query) searchParams.append('query', params.query);
if (params.categories) searchParams.append('categories', params.categories);
if (params.radius) searchParams.append('radius', params.radius.toString());
if (params.limit) searchParams.append('limit', params.limit.toString());
    return fetchApi(`/places?${searchParams.toString()}`);
  },

  getPlace: (placeId: string): Promise<Place> => {
    return fetchApi(`/places/${placeId}`);
  },

  getTrendingPlaces: (location: string, limit: number = 10): Promise<Place[]> => {
    return fetchApi(`/places/trending/${encodeURIComponent(location)}?limit=${limit}`);
  },
};

export const ItineraryApi = {
  createItinerary: (request: ItineraryRequest): Promise<ItineraryResponse> => {
    return fetchApi('/itinerary', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

export const PreferencesApi = {
  parsePreferences: (request: PreferencesParseRequest): Promise<PreferencesParseResponse> => {
    return fetchApi('/preferences/parse', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

export const HealthApi = {
  ping: (): Promise<PingResponse> => {
    return fetchApi('/ping');
  },

  health: (): Promise<HealthResponse> => {
    return fetchApi('/health');
  },

  demo: (): Promise<DemoResponse> => {
    return fetchApi('/demo');
  },
};
