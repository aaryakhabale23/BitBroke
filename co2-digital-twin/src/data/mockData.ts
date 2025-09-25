import { CityData, TimeSeriesData } from '@/types/dashboard';

export const mockCities: CityData[] = [
  {
    id: '1',
    name: 'New York',
    country: 'United States',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    emissions: { current: 2.1, saved: 150, changePercent: 4.2 },
    population: 8336817,
    area: 783.8
  },
  {
    id: '2',
    name: 'London',
    country: 'United Kingdom',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    emissions: { current: 1.8, saved: 120, changePercent: -2.1 },
    population: 8982000,
    area: 1572
  },
  {
    id: '3',
    name: 'Tokyo',
    country: 'Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    emissions: { current: 3.2, saved: 200, changePercent: 1.5 },
    population: 13929286,
    area: 2194
  },
  {
    id: '4',
    name: 'Beijing',
    country: 'China',
    coordinates: { lat: 39.9042, lng: 116.4074 },
    emissions: { current: 4.8, saved: 180, changePercent: 8.3 },
    population: 21540000,
    area: 16410
  },
  {
    id: '5',
    name: 'Mumbai',
    country: 'India',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    emissions: { current: 2.5, saved: 90, changePercent: 6.7 },
    population: 12442373,
    area: 603.4
  },
  {
    id: '6',
    name: 'São Paulo',
    country: 'Brazil',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    emissions: { current: 1.9, saved: 110, changePercent: 3.2 },
    population: 12325232,
    area: 1521
  },
  {
    id: '7',
    name: 'Sydney',
    country: 'Australia',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    emissions: { current: 1.2, saved: 75, changePercent: -1.8 },
    population: 5312163,
    area: 12367.7
  },
  {
    id: '8',
    name: 'Paris',
    country: 'France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    emissions: { current: 1.5, saved: 95, changePercent: -3.5 },
    population: 2161000,
    area: 105.4
  },
  {
    id: '9',
    name: 'Berlin',
    country: 'Germany',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    emissions: { current: 1.1, saved: 85, changePercent: -4.1 },
    population: 3669491,
    area: 891.8
  },
  {
    id: '10',
    name: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    emissions: { current: 2.8, saved: 65, changePercent: 12.5 },
    population: 3400000,
    area: 4114
  },
  {
    id: '11',
    name: 'Toronto',
    country: 'Canada',
    coordinates: { lat: 43.6532, lng: -79.3832 },
    emissions: { current: 1.4, saved: 100, changePercent: -0.8 },
    population: 2731571,
    area: 630.2
  },
  {
    id: '12',
    name: 'Singapore',
    country: 'Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    emissions: { current: 0.9, saved: 45, changePercent: 2.3 },
    population: 5850000,
    area: 722.5
  }
];

export const mockTimeSeriesData: TimeSeriesData[] = [
  { year: 2019, energy: 2.1, transport: 1.8, other: 1.5, total: 5.4 },
  { year: 2020, energy: 2.0, transport: 1.2, other: 1.4, total: 4.6 },
  { year: 2021, energy: 2.2, transport: 1.5, other: 1.6, total: 5.3 },
  { year: 2022, energy: 2.4, transport: 1.7, other: 1.7, total: 5.8 },
  { year: 2023, energy: 2.6, transport: 1.9, other: 1.8, total: 6.3 },
  { year: 2024, energy: 2.5, transport: 1.8, other: 1.7, total: 6.0 },
  { year: 2025, energy: 2.7, transport: 2.0, other: 1.8, total: 6.5 }
];

// Calculate total emissions from all cities
export const getTotalEmissions = (): number => {
  return mockCities.reduce((total, city) => total + city.emissions.current, 0);
};

// Calculate total CO2 saved
export const getTotalSaved = (): number => {
  return mockCities.reduce((total, city) => total + city.emissions.saved, 0);
};

// Calculate average change percentage
export const getAverageChange = (): number => {
  const totalChange = mockCities.reduce((total, city) => total + city.emissions.changePercent, 0);
  return totalChange / mockCities.length;
};