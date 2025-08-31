// import { useEffect, useState } from "react";
// import { fetchApi } from "@/shared/api";
// import PlanningMap from "@/components/PlanningMap";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// interface Place {
//   id: string;
//   name: string;
//   location: { lat: number; lng: number };
//   address?: string;
//   categories?: string[];
//   rating?: number | null;
// }

// export default function Plan() {
//   const [query, setQuery] = useState("");
//   const [places, setPlaces] = useState<Place[]>([]);
//   const [loading, setLoading] = useState(false);

//   // --- Fetch trending if no input ---
//   useEffect(() => {
//     if (places.length === 0) {
//       fetchTrending("india"); // fallback region
//     }
//   }, []);

//   async function fetchTrending(region: string) {
//     setLoading(true);
//     try {
//       const res = await fetchApi(`/api/places/trending?region=${region}&limit=8`);
//       setPlaces(res);
//     } catch (err) {
//       console.error("Error fetching trending:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handlePlan() {
//     if (!query.trim()) {
//       fetchTrending("india");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Step 1: Parse user preferences
//       const parsed = await fetchApi("/api/preferences/parse", {
//         method: "POST",
//         body: { text: query },
//       });

//       // Step 2: If locations exist, search around them
//       if (parsed.locations?.length > 0) {
//         const loc = parsed.locations[0]; // pick first location
//         const ll = `${loc.lat},${loc.lng}`;
//         const res = await fetchApi(`/api/places/search?ll=${ll}&query=${parsed.preferences.join(",")}&limit=8`);
//         setPlaces(res);
//       } else {
//         // fallback if no locations found
//         fetchTrending("india");
//       }
//     } catch (err) {
//       console.error("Error generating plan:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Plan Your Trip</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2">
//             <Input
//               placeholder="E.g. I want to explore art galleries in Delhi"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//             <Button onClick={handlePlan} disabled={loading}>
//               {loading ? "Planning..." : "Plan"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="md:col-span-2">
//         <CardContent>
//           <PlanningMap places={places} />
//           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {places.map((p) => (
//               <Card key={p.id}>
//                 <CardHeader>
//                   <CardTitle>{p.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p>{p.address}</p>
//                   {p.categories && (
//                     <p className="text-sm text-gray-500">{p.categories.join(", ")}</p>
//                   )}
//                   {p.rating && <p className="text-sm">⭐ {p.rating}</p>}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { fetchApi, Place } from "@/shared/api";
import PlanningMap from "@/components/PlanningMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Plan() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [city, setCity] = useState("Delhi");
  const [query, setQuery] = useState("museum");
  const [loading, setLoading] = useState(false);

  async function loadPlaces(cityName: string, searchQuery: string) {
    setLoading(true);
    try {
      // 1. Geocode city -> lat/lng
      const coords = await fetchApi<{ latitude: number; longitude: number }>(
        `/api/geocode?name=${cityName}`
      );
      if (!coords.latitude || !coords.longitude) {
        console.error("City not found");
        setPlaces([]);
        return;
      }

      // 2. Fetch places for that query
      const resp = await fetchApi<Place[]>(
        `/api/places?query=${searchQuery}&ll=${coords.latitude},${coords.longitude}&limit=10`
      );
      setPlaces(resp);
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaces(city, query);
  }, []);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              className="border rounded px-2 py-1 w-48"
              placeholder="Enter a city (e.g. Delhi)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              className="border rounded px-2 py-1 w-48"
              placeholder="What are you looking for? (e.g. cafes)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={() => loadPlaces(city, query)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Search
            </button>
          </div>

          {loading ? (
            <p>Loading places...</p>
          ) : (
            <PlanningMap places={places} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
