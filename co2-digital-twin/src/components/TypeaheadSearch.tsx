import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { CityData, SearchSuggestion } from '@/types/dashboard';
import { Search, MapPin, Globe, Users } from 'lucide-react';

interface TypeaheadSearchProps {
  cities: CityData[];
  onCitySelect: (city: CityData) => void;
  onCoordinatesDisplay: (lat: number, lng: number) => void;
}

export const TypeaheadSearch: React.FC<TypeaheadSearchProps> = ({
  cities,
  onCitySelect,
  onCoordinatesDisplay
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Configure Fuse.js for fuzzy searching
  useEffect(() => {
    const fuse = new Fuse(cities, {
      keys: ['name', 'country'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 1
    });

    if (query.length > 0) {
      const results = fuse.search(query).slice(0, 6);
      const mappedResults: SearchSuggestion[] = results.map(result => ({
        city: result.item,
        score: result.score || 0
      }));
      setSuggestions(mappedResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, cities]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleCitySelect(suggestions[selectedIndex].city);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleCitySelect = (city: CityData) => {
    setQuery(city.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onCitySelect(city);
    onCoordinatesDisplay(city.coordinates.lat, city.coordinates.lng);
    inputRef.current?.blur();
  };

  const formatPopulation = (population: number): string => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    }
    if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search cities..."
          className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-md border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200 text-gray-700"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.city.id}
              className={`p-4 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex 
                  ? 'bg-green-50 border-l-4 border-green-500' 
                  : 'hover:bg-gray-50'
              } ${index < suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
              onClick={() => handleCitySelect(suggestion.city)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-gray-900">
                      {suggestion.city.name}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600 text-sm">
                      {suggestion.city.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>
                        {suggestion.city.coordinates.lat.toFixed(2)}°, {suggestion.city.coordinates.lng.toFixed(2)}°
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{formatPopulation(suggestion.city.population)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">
                    {suggestion.city.emissions.current.toFixed(1)} Gt
                  </div>
                  <div className="text-xs text-gray-500">CO₂ Emissions</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No cities found matching &quot;{query}&quot;</p>
          </div>
        </div>
      )}
    </div>
  );
};