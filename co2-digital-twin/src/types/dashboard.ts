export interface CityData {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  emissions: {
    current: number; // Current CO2 emissions in Gt
    saved: number; // CO2 saved in Mt
    changePercent: number; // Year-over-year change percentage
  };
  population: number;
  area: number; // in km²
}

export interface TimeSeriesData {
  year: number;
  energy: number;
  transport: number;
  other: number;
  total: number;
}

export interface KpiCardData {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}

export interface SearchSuggestion {
  city: CityData;
  score: number;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export interface DashboardState {
  selectedCity: CityData | null;
  searchQuery: string;
  mapViewport: MapViewport;
  timeSeriesData: TimeSeriesData[];
  isLoading: boolean;
}