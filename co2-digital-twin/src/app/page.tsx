'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { KpiCards } from '@/components/KpiCards';
import { EmissionsChart, CityEmissionsBarChart, EmissionsSavingsChart } from '@/components/Charts';
import { Interventions } from '@/components/Interventions';
import { ProfilePanel } from '@/components/ProfilePanel';
import { mockCities, mockTimeSeriesData, getTotalEmissions, getTotalSaved, getAverageChange } from '@/data/mockData';
import { CityData } from '@/types/dashboard';
import { User, BarChart3, Globe } from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/LeafletMap').then(mod => mod.LeafletMap), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-lg bg-slate-800 flex items-center justify-center">
      <div className="text-white text-lg">Loading Map...</div>
    </div>
  )
});

export default function Dashboard() {
  // Set New York as the default selected city
  const [selectedCity, setSelectedCity] = useState<CityData | null>(mockCities[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([mockCities[0].coordinates.lat, mockCities[0].coordinates.lng]);
  const [mapZoom, setMapZoom] = useState(10);
  const [coordinatesDisplay, setCoordinatesDisplay] = useState<{ lat: number; lng: number } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Start with some preset interventions for the default city to show functionality
  const [selectedInterventions, setSelectedInterventions] = useState<any[]>([
    {
      id: 'ev-infrastructure',
      name: 'Electric Vehicle Infrastructure',
      description: 'Build charging stations and incentivize EV adoption',
      estimatedReductionMin: 0.8,
      estimatedReductionMax: 1.2
    },
    {
      id: 'green-buildings',
      name: 'Green Building Standards',
      description: 'Implement energy-efficient building codes and retrofits',
      estimatedReductionMin: 0.5,
      estimatedReductionMax: 0.9
    }
  ]);

  // Calculate KPI values
  const totalEmissions = getTotalEmissions();
  const totalSaved = getTotalSaved();
  const averageChange = getAverageChange();

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    setMapCenter([city.coordinates.lat, city.coordinates.lng]);
    setMapZoom(10);
  };

  const handleCoordinatesDisplay = (lat: number, lng: number) => {
    setCoordinatesDisplay({ lat, lng });
    setMapCenter([lat, lng]);
    setMapZoom(8);
  };

  const handleAddIntervention = (intervention: any) => {
    setSelectedInterventions(prev => [...prev, intervention]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-800 shadow-lg border-b border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Hestia</h1>
                <p className="text-sm text-green-200">CO₂ Emissions Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-200" />
                <span className="text-sm text-green-200">Reports</span>
              </div>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 text-green-200 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <KpiCards 
          totalEmissions={totalEmissions}
          changePercent={averageChange}
          totalSaved={totalSaved}
        />

        {/* Coordinates Display */}
        {coordinatesDisplay && (
          <div className="mb-6 p-4 bg-white rounded-lg border-2 border-green-500 shadow-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Globe className="w-5 h-5" />
              <span className="font-medium">Selected Coordinates:</span>
              <span className="font-mono bg-green-100 px-3 py-1 rounded">
                {coordinatesDisplay.lat.toFixed(4)}°N, {coordinatesDisplay.lng.toFixed(4)}°E
              </span>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Map Section */}
          <div className="bg-white rounded-lg p-4 border-2 border-green-500 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Emissions by City
              </h2>
              <div className="text-sm text-gray-600">
                {selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : 'Select a city to view details'}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-800 text-sm">
                🔍 <strong>Search cities above or click markers on the map</strong> to explore different emissions data and intervention strategies
              </p>
            </div>
            
            <div className="h-96 relative">
              <LeafletMap
                cities={mockCities}
                selectedCity={selectedCity}
                onCitySelect={handleCitySelect}
                center={mapCenter}
                zoom={mapZoom}
              />
            </div>
          </div>

          {/* Selected City Details & Interventions */}
          <div className="space-y-6">
            {/* City Selection Prompt */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">City Analysis</h4>
              </div>
              <p className="text-blue-700 text-sm">
                Currently viewing: <span className="font-semibold">{selectedCity?.name}, {selectedCity?.country}</span>
              </p>
              <p className="text-blue-600 text-xs mt-1">
                💡 Search and select different cities on the map to compare emissions data and interventions
              </p>
            </div>

            {selectedCity && (
              <>
                {/* Selected City Details */}
                <div className="bg-white rounded-lg p-6 border-2 border-green-500 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">City Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="text-gray-900 font-medium">
                        {(selectedCity.population / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="text-gray-900 font-medium">
                        {selectedCity.area.toLocaleString()} km²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CO₂ Emissions:</span>
                      <span className="text-gray-900 font-medium">
                        {selectedCity.emissions.current.toFixed(1)} Gt
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CO₂ Saved:</span>
                      <span className="text-gray-900 font-medium">
                        {selectedCity.emissions.saved} Mt
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year-over-year:</span>
                      <span className={`font-medium ${
                        selectedCity.emissions.changePercent >= 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedCity.emissions.changePercent >= 0 ? '+' : ''}
                        {selectedCity.emissions.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interventions */}
                <div className="max-h-96 overflow-y-auto">
                  <Interventions
                    city={selectedCity}
                    onAddIntervention={handleAddIntervention}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <CityEmissionsBarChart
              cities={mockCities.map(city => ({
                name: city.name,
                emissions: city.emissions.current,
                country: city.country
              }))}
              className="h-full"
            />
          </div>
          
          <div className="h-80">
            <EmissionsSavingsChart
              cities={mockCities.map(city => ({
                name: city.name,
                saved: city.emissions.saved,
                country: city.country
              }))}
              className="h-full"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 border-t border-green-600 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center text-green-200 text-sm">
            <div>
              © 2025 Hestia CO₂ Digital Twin. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Panel */}
      <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
