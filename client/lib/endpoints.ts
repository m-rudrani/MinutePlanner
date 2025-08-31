import api from "./api";

// Health check
export const getHealth = async () => {
  const res = await api.get("/health");
  return res.data;
};

// Places search
export const searchPlaces = async (ll: string, query: string, limit = 5) => {
  const res = await api.get("/places/search", { params: { ll, query, limit } });
  return res.data;
};

// Generate itinerary
export const generateItinerary = async (items: { name: string; location: string }[]) => {
  const res = await api.post("/itinerary", items);
  return res.data;
};

// HuggingFace parse
export const parsePreferences = async (text: string) => {
  const res = await api.post("/preferences/parse", { text });
  return res.data;
};

// MapTiler config
export const getConfig = async () => {
  const res = await api.get("/config");
  return res.data;
};
