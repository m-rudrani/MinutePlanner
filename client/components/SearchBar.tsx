import { useState } from "react";
import { searchPlaces } from "../lib/endpoints";

export default function SearchBar({ onResults }: { onResults: (results: any[]) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await searchPlaces("28.6139,77.2090", query, 5); // default Delhi coords
      onResults(res.results || []);
    } catch (e) {
      console.error("Search error", e);
    }
  };

  return (
    <div className="flex gap-2 p-2 border-b bg-white shadow">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2"
        placeholder="Search for places..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
