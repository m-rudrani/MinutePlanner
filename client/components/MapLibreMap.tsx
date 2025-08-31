import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Place } from '@shared/api';

interface MapLibreMapProps {
  places?: Place[];
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  style?: React.CSSProperties;
  className?: string;
  onMapClick?: (event: maplibregl.MapMouseEvent) => void;
  onPlaceClick?: (place: Place) => void;
}

const MapLibreMap: React.FC<MapLibreMapProps> = ({
  places = [],
  center = [139.6917, 35.6895], // Tokyo center
  zoom = 12,
  style,
  className = '',
  onMapClick,
  onPlaceClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#f0f8ff'
            }
          },
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: center,
      zoom: zoom,
      attributionControl: true
    });

    map.current.on('load', () => {
      setIsLoaded(true);
    });

    if (onMapClick) {
      map.current.on('click', onMapClick);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsLoaded(false);
      }
    };
  }, [center, zoom, onMapClick]);

  // Add places as markers when places change
  useEffect(() => {
    if (!map.current || !isLoaded || !places.length) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.maplibre-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    places.forEach((place) => {
      if (place.latitude && place.longitude) {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'maplibre-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: hsl(210, 100%, 47%);
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: bold;
        `;
        markerElement.innerHTML = '📍';

        // Add click event
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          onPlaceClick?.(place);
        });

        // Create popup
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3 min-w-48">
            <h3 class="font-semibold text-sm mb-2">${place.name}</h3>
            <p class="text-xs text-gray-600 mb-2">${place.category}</p>
            <div class="flex items-center justify-between text-xs">
              <span class="text-yellow-600">⭐ ${place.rating}</span>
              <span class="text-green-600">${place.price}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">${place.duration}</p>
          </div>
        `);

        // Create and add marker
        const marker = new maplibregl.Marker(markerElement)
          .setLngLat([place.longitude, place.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        // Store marker reference on element for cleanup
        markerElement.setAttribute('data-place-id', place.id);
      }
    });

    // Fit map to show all places if there are any
    if (places.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      places.forEach(place => {
        if (place.latitude && place.longitude) {
          bounds.extend([place.longitude, place.latitude]);
        }
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } else if (places.length === 1) {
      const place = places[0];
      if (place.latitude && place.longitude) {
        map.current.flyTo({
          center: [place.longitude, place.latitude],
          zoom: 14
        });
      }
    }
  }, [places, isLoaded, onPlaceClick]);

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-full rounded-lg overflow-hidden ${className}`}
      style={style}
    />
  );
};

export default MapLibreMap;
