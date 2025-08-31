// import { useState, useEffect } from 'react';
// import { MapPin, Clock, Star, DollarSign } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import MapLibreMap from './MapLibreMap';
// import { Place } from '@shared/api';

// interface PlanningMapProps {
//   places: Place[];
//   selectedPlaces: Place[];
//   onPlaceSelect: (place: Place) => void;
//   onPlaceDeselect: (place: Place) => void;
//   destination?: string;
//   className?: string;
// }

// const PlanningMap: React.FC<PlanningMapProps> = ({
//   places,
//   selectedPlaces,
//   onPlaceSelect,
//   onPlaceDeselect,
//   destination = "Your Destination",
//   className = ''
// }) => {
//   const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
//   const [mapCenter, setMapCenter] = useState<[number, number]>([139.6917, 35.6895]);

//   // Update map center based on places
//   useEffect(() => {
//     if (places.length > 0) {
//       const avgLng = places.reduce((sum, place) => sum + (place.longitude || 0), 0) / places.length;
//       const avgLat = places.reduce((sum, place) => sum + (place.latitude || 0), 0) / places.length;
//       setMapCenter([avgLng, avgLat]);
//     }
//   }, [places]);

//   const handlePlaceClick = (place: Place) => {
//     setSelectedPlace(place);
//   };

//   const isPlaceSelected = (place: Place) => {
//     return selectedPlaces.some(selected => selected.id === place.id);
//   };

//   const togglePlaceSelection = (place: Place) => {
//     if (isPlaceSelected(place)) {
//       onPlaceDeselect(place);
//     } else {
//       onPlaceSelect(place);
//     }
//   };

//   return (
//     <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 h-full ${className}`}>
//       {/* Map Container */}
//       <div className="lg:col-span-2 relative">
//         <div className="h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden border">
//           <MapLibreMap
//             places={places}
//             center={mapCenter}
//             zoom={12}
//             onPlaceClick={handlePlaceClick}
//             className="w-full h-full"
//           />
//         </div>
        
//         {/* Map Legend */}
//         <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
//           <div className="text-sm font-medium text-gray-900 mb-2">
//             {destination}
//           </div>
//           <div className="space-y-1">
//             <div className="flex items-center space-x-2 text-xs">
//               <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//               <span className="text-gray-600">Available Places</span>
//             </div>
//             <div className="flex items-center space-x-2 text-xs">
//               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               <span className="text-gray-600">Selected Places</span>
//             </div>
//           </div>
//         </div>

//         {/* Stats Overlay */}
//         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
//           <div className="text-center">
//             <div className="text-lg font-bold text-blue-600">{selectedPlaces.length}</div>
//             <div className="text-xs text-gray-600">Selected</div>
//           </div>
//         </div>
//       </div>

//       {/* Places List & Details */}
//       <div className="space-y-4 max-h-[600px] overflow-y-auto">
//         {/* Selected Place Details */}
//         {selectedPlace && (
//           <Card className="border-blue-200 bg-blue-50/50">
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <CardTitle className="text-lg">{selectedPlace.name}</CardTitle>
//                   <div className="flex items-center space-x-2 mt-1">
//                     <Badge variant="secondary" className="text-xs">
//                       {selectedPlace.category}
//                     </Badge>
//                     <div className="flex items-center space-x-1 text-sm text-gray-600">
//                       <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                       <span>{selectedPlace.rating}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant={isPlaceSelected(selectedPlace) ? "default" : "outline"}
//                   onClick={() => togglePlaceSelection(selectedPlace)}
//                 >
//                   {isPlaceSelected(selectedPlace) ? "Remove" : "Add"}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <p className="text-sm text-gray-600 mb-3">{selectedPlace.description}</p>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="flex items-center space-x-2">
//                   <Clock className="w-4 h-4 text-gray-400" />
//                   <span>{selectedPlace.duration}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <DollarSign className="w-4 h-4 text-gray-400" />
//                   <span>{selectedPlace.price}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Places List */}
//         <div className="space-y-3">
//           <h3 className="font-semibold text-lg">Nearby Places</h3>
//           {places.map((place) => (
//             <Card 
//               key={place.id} 
//               className={`cursor-pointer transition-all hover:shadow-md ${
//                 isPlaceSelected(place) 
//                   ? 'border-green-500 bg-green-50/50' 
//                   : selectedPlace?.id === place.id 
//                     ? 'border-blue-500 bg-blue-50/50'
//                     : 'hover:border-gray-300'
//               }`}
//               onClick={() => handlePlaceClick(place)}
//             >
//               <CardContent className="p-4">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h4 className="font-medium text-sm">{place.name}</h4>
//                     <p className="text-xs text-gray-600 mt-1">{place.category}</p>
                    
//                     <div className="flex items-center space-x-3 mt-2 text-xs">
//                       <div className="flex items-center space-x-1">
//                         <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                         <span>{place.rating}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="w-3 h-3 text-gray-400" />
//                         <span>{place.duration}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <DollarSign className="w-3 h-3 text-gray-400" />
//                         <span>{place.price}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col items-end space-y-2">
//                     <Button
//                       size="sm"
//                       variant={isPlaceSelected(place) ? "default" : "outline"}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         togglePlaceSelection(place);
//                       }}
//                       className="text-xs px-3 py-1"
//                     >
//                       {isPlaceSelected(place) ? "✓" : "+"}
//                     </Button>
//                     {place.distance && (
//                       <span className="text-xs text-gray-500">{place.distance}</span>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {places.length === 0 && (
//           <Card>
//             <CardContent className="p-6 text-center">
//               <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-600">No places found for this location.</p>
//               <p className="text-sm text-gray-500 mt-1">Try searching for a different destination.</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlanningMap;

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
}

interface Props {
  places: Place[];
}

export default function PlanningMap({ places }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;
    if (!mapContainer.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [77.2090, 28.6139], // Default: Delhi
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      new maplibregl.Marker()
        .setLngLat([place.longitude, place.latitude])
        .setPopup(new maplibregl.Popup().setText(place.name))
        .addTo(mapRef.current!);
    });
  }, [places]);

  return <div ref={mapContainer} className="h-[500px] w-full rounded-lg shadow" />;
}
