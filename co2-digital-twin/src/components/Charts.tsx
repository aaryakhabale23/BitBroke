'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TimeSeriesData } from '@/types/dashboard';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface EmissionsChartProps {
  data: TimeSeriesData[];
  className?: string;
}

export const EmissionsChart: React.FC<EmissionsChartProps> = ({ 
  data, 
  className = "" 
}) => {
  const years = data.map(d => d.year);
  
  const plotData = [
    {
      x: years,
      y: data.map(d => d.energy),
      name: 'Energy',
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      line: { color: '#10b981', width: 3 },
      marker: { size: 8 },
      fill: 'tonexty' as const,
      fillcolor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      x: years,
      y: data.map(d => d.transport),
      name: 'Transport',
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      line: { color: '#f59e0b', width: 3 },
      marker: { size: 8 },
      fill: 'tonexty' as const,
      fillcolor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      x: years,
      y: data.map(d => d.other),
      name: 'Other',
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      line: { color: '#8b5cf6', width: 3 },
      marker: { size: 8 },
      fill: 'tonexty' as const,
      fillcolor: 'rgba(139, 92, 246, 0.1)'
    }
  ];

  const layout = {
    title: {
      text: 'Emissions Over Time',
      font: { color: '#1f2937', size: 18 },
      x: 0.05
    },
    xaxis: {
      title: { text: 'Year', color: '#6b7280' },
      gridcolor: 'rgba(107, 114, 128, 0.2)',
      color: '#6b7280',
      showgrid: true
    },
    yaxis: {
      title: { text: 'CO₂ Emissions (Gt)', color: '#6b7280' },
      gridcolor: 'rgba(107, 114, 128, 0.2)',
      color: '#6b7280',
      showgrid: true
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#6b7280' },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#d1d5db',
      borderwidth: 1
    },
    margin: { l: 60, r: 40, t: 60, b: 60 },
    hovermode: 'x unified' as const
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-lg border-2 border-green-500 ${className}`}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

interface CityEmissionsBarChartProps {
  cities: Array<{ name: string; emissions: number; country: string }>;
  className?: string;
}

export const CityEmissionsBarChart: React.FC<CityEmissionsBarChartProps> = ({ 
  cities, 
  className = "" 
}) => {
  const sortedCities = cities.sort((a, b) => b.emissions - a.emissions).slice(0, 10);
  
  const plotData = [{
    x: sortedCities.map(city => city.name),
    y: sortedCities.map(city => city.emissions),
    type: 'bar' as const,
    marker: {
      color: sortedCities.map(city => 
        city.emissions > 3 ? '#ef4444' : 
        city.emissions > 2 ? '#f59e0b' : '#10b981'
      ),
      line: { color: 'rgba(255,255,255,0.2)', width: 1 }
    },
    text: sortedCities.map(city => `${city.emissions.toFixed(1)} Gt`),
    textposition: 'outside' as const,
    textfont: { color: '#6b7280' },
    hovertemplate: '<b>%{x}</b><br>CO₂ Emissions: %{y:.1f} Gt<extra></extra>'
  }];

  const layout = {
    title: {
      text: 'Top 10 Cities by CO₂ Emissions',
      font: { color: '#1f2937', size: 18 },
      x: 0.05
    },
    xaxis: {
      title: { text: 'Cities', color: '#6b7280' },
      tickangle: -45,
      color: '#6b7280'
    },
    yaxis: {
      title: { text: 'CO₂ Emissions (Gt)', color: '#6b7280' },
      gridcolor: 'rgba(107, 114, 128, 0.2)',
      color: '#6b7280',
      showgrid: true
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#002a7eff' },
    margin: { l: 60, r: 40, t: 60, b: 100 }
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-lg border-2 border-green-500 ${className}`}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

interface EmissionsSavingsChartProps {
  cities: Array<{ name: string; saved: number; country: string }>;
  className?: string;
}

export const EmissionsSavingsChart: React.FC<EmissionsSavingsChartProps> = ({ 
  cities, 
  className = "" 
}) => {
  const sortedCities = cities.sort((a, b) => b.saved - a.saved).slice(0, 8);
  
  const plotData = [{
    labels: sortedCities.map(city => city.name),
    values: sortedCities.map(city => city.saved),
    type: 'pie' as const,
    marker: {
      colors: [
        '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
        '#f59e0b', '#ef4444', '#ec4899', '#84cc16'
      ],
      line: { color: 'white', width: 2 }
    },
    textinfo: 'label+percent' as const,
    textposition: 'outside' as const,
    textfont: { color: '#374151', family: 'Arial, sans-serif', size: 14 },
    hovertemplate: '<b>%{label}</b><br>CO₂ Saved: %{value} Mt<br>Percentage: %{percent}<extra></extra>'
  }];

  const layout = {
    title: {
      text: 'CO₂ Savings by City',
      font: { color: '#1f2937', size: 18 },
      x: 0.5
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#6b7280' },
    showlegend: false,
    margin: { l: 40, r: 40, t: 60, b: 40 }
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-lg border-2 border-green-500 ${className}`}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};