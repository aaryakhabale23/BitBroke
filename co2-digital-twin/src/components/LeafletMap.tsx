'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { CityData } from '@/types/dashboard';
import { TypeaheadSearch } from '@/components/TypeaheadSearch';

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface LeafletMapProps {
  cities: CityData[];
  selectedCity: CityData | null;
  onCitySelect: (city: CityData) => void;
  center: [number, number];
  zoom: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMapReady?: (map: any) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  cities,
  selectedCity,
  onCitySelect,
  center,
  zoom,
  onMapReady
}) => {
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (mapInstance && center && zoom) {
      mapInstance.setView(center, zoom);
    }
  }, [mapInstance, center, zoom]);

  const handleCitySelectFromSearch = (city: CityData) => {
    onCitySelect(city);
    if (mapInstance) {
      mapInstance.setView([city.coordinates.lat, city.coordinates.lng], 10);
    }
  };

  const handleCoordinatesDisplay = (lat: number, lng: number) => {
    if (mapInstance) {
      mapInstance.setView([lat, lng], 10);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading Map...</div>
      </div>
    );
  }

  // Custom marker component that handles the dynamic import of Leaflet
  const CustomMarker = ({ city }: { city: CityData }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [L, setL] = useState<any>(null);

    useEffect(() => {
      import('leaflet').then((leaflet) => {
        setL(leaflet.default);
      });
    }, []);

    if (!L) return null;

    const isSelected = selectedCity?.id === city.id;
    const emissionLevel = city.emissions.current;
    
    let iconSize = 20;
    let iconColor = '#10b981'; // green-500
    
    if (emissionLevel > 3) {
      iconSize = 30;
      iconColor = '#ef4444'; // red-500
    } else if (emissionLevel > 2) {
      iconSize = 25;
      iconColor = '#f59e0b'; // amber-500
    }

    if (isSelected) {
      iconSize += 10;
    }

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          background: ${iconColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          ${isSelected ? 'transform: scale(1.2); box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);' : ''}
        ">
          ${emissionLevel.toFixed(1)}
        </div>
      `,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
      popupAnchor: [0, -iconSize / 2]
    });

    return (
      <Marker 
        position={[city.coordinates.lat, city.coordinates.lng]} 
        icon={customIcon}
        eventHandlers={{
          click: () => onCitySelect(city)
        }}
      >
        <Popup>
          <div className="p-4 min-w-64">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <h3 className="text-lg font-bold text-gray-900">{city.name}</h3>
              </div>
              <span className="text-sm text-gray-500">{city.country}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-xs text-red-600 mb-1">CO₂ Emissions</div>
                <div className="text-lg font-bold text-red-700">{city.emissions.current.toFixed(1)} Gt</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-green-600 mb-1">CO₂ Saved</div>
                <div className="text-lg font-bold text-green-700">{city.emissions.saved} Mt</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-gray-600">Change: </span>
                <span className={`${city.emissions.changePercent >= 0 ? 'text-red-600' : 'text-green-600'} font-semibold`}>
                  {city.emissions.changePercent >= 0 ? '+' : ''}{city.emissions.changePercent.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V8z"></path>
                </svg>
                <span>{(city.population / 1000000).toFixed(1)}M people</span>
              </div>
              <div className="text-xs">
                {city.coordinates.lat.toFixed(2)}°, {city.coordinates.lng.toFixed(2)}°
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <>
      {/* Search Box Overlay */}
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <TypeaheadSearch
          cities={cities}
          onCitySelect={handleCitySelectFromSearch}
          onCoordinatesDisplay={handleCoordinatesDisplay}
        />
      </div>

      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={(mapRef: any) => {
            if (mapRef) {
              setMapInstance(mapRef);
              onMapReady?.(mapRef);
            }
          }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {cities.map(city => (
            <CustomMarker key={city.id} city={city} />
          ))}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">CO₂ Emissions (Gt)</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Low (0-2 Gt)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-amber-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Medium (2-3 Gt)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">High (3+ Gt)</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Click markers for details
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-marker:hover {
          transform: scale(1.1) !important;
        }
        
        .leaflet-container {
          font-family: inherit;
        }
        
        .leaflet-control-zoom a {
          background-color: white;
          border: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .leaflet-control-zoom a:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </>
  );
};