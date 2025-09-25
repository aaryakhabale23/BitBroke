import React, { useState } from 'react';
import { CityData } from '@/types/dashboard';
import { Plus, Building2, TreePine, Lightbulb, Zap, Car, Filter, Leaf, Wind, Flame, Calculator, TrendingDown, AlertTriangle } from 'lucide-react';

interface InterventionType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  estimatedReductionMin: number; // in Gt/year
  estimatedReductionMax: number; // in Gt/year
  cost: string;
  category: 'urban' | 'rural';
}

const URBAN_INTERVENTIONS: InterventionType[] = [
  {
    id: 'green-walls',
    name: 'Green Walls & Rooftop Gardens',
    description: 'Capture CO₂ and improve air quality through urban vegetation',
    icon: <Leaf className="w-5 h-5" />,
    estimatedReductionMin: 0.2,
    estimatedReductionMax: 0.5,
    cost: 'Medium',
    category: 'urban'
  },
  {
    id: 'electric-transport',
    name: 'Electric Public Transport',
    description: 'EV buses, metro expansion to directly cut vehicle CO₂ emissions',
    icon: <Zap className="w-5 h-5" />,
    estimatedReductionMin: 1.2,
    estimatedReductionMax: 2.1,
    cost: 'High',
    category: 'urban'
  },
  {
    id: 'low-emission-zones',
    name: 'Low Emission Zones',
    description: 'Car-free streets and restrictions on fossil-fuel cars in hotspots',
    icon: <Car className="w-5 h-5" />,
    estimatedReductionMin: 0.8,
    estimatedReductionMax: 1.5,
    cost: 'Low',
    category: 'urban'
  },
  {
    id: 'carbon-capture',
    name: 'Roadside Carbon Capture Units',
    description: 'Small-scale filters to absorb CO₂ near highways',
    icon: <Filter className="w-5 h-5" />,
    estimatedReductionMin: 0.3,
    estimatedReductionMax: 0.7,
    cost: 'High',
    category: 'urban'
  },
  {
    id: 'energy-efficient-buildings',
    name: 'Energy-Efficient Buildings',
    description: 'Solar rooftops to reduce reliance on coal-based electricity',
    icon: <Building2 className="w-5 h-5" />,
    estimatedReductionMin: 1.5,
    estimatedReductionMax: 3.0,
    cost: 'Medium',
    category: 'urban'
  }
];

const RURAL_INTERVENTIONS: InterventionType[] = [
  {
    id: 'agroforestry',
    name: 'Agroforestry & Reforestation',
    description: 'Planting trees around farms and degraded land',
    icon: <TreePine className="w-5 h-5" />,
    estimatedReductionMin: 2.0,
    estimatedReductionMax: 4.5,
    cost: 'Medium',
    category: 'rural'
  },
  {
    id: 'biochar',
    name: 'Biochar Production',
    description: 'Convert crop residue to carbon-rich biochar instead of burning',
    icon: <Flame className="w-5 h-5" />,
    estimatedReductionMin: 0.5,
    estimatedReductionMax: 1.2,
    cost: 'Low',
    category: 'rural'
  },
  {
    id: 'biogas',
    name: 'Biogas Plants',
    description: 'Convert livestock and organic waste into clean energy',
    icon: <Wind className="w-5 h-5" />,
    estimatedReductionMin: 0.8,
    estimatedReductionMax: 1.8,
    cost: 'Medium',
    category: 'rural'
  },
  {
    id: 'solar-irrigation',
    name: 'Solar-Powered Irrigation',
    description: 'Replace diesel-based pumps with solar-powered systems',
    icon: <Lightbulb className="w-5 h-5" />,
    estimatedReductionMin: 0.3,
    estimatedReductionMax: 0.8,
    cost: 'Medium',
    category: 'rural'
  },
  {
    id: 'clean-cookstoves',
    name: 'Cleaner Cookstoves',
    description: 'Reduce household emissions from firewood burning',
    icon: <Flame className="w-5 h-5" />,
    estimatedReductionMin: 0.2,
    estimatedReductionMax: 0.6,
    cost: 'Low',
    category: 'rural'
  }
];

interface InterventionsProps {
  city: CityData;
  onAddIntervention: (intervention: InterventionType) => void;
  onImpactCalculated?: (impact: { totalReductionMin: number; totalReductionMax: number; selectedCount: number }) => void;
}

export const Interventions: React.FC<InterventionsProps> = ({ city, onAddIntervention, onImpactCalculated }) => {
  const [activeTab, setActiveTab] = useState<'urban' | 'rural'>('urban');
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [calculatedImpact, setCalculatedImpact] = useState<{
    totalReductionMin: number;
    totalReductionMax: number;
    currentEmissions: number;
    projectedEmissions: number;
    percentageReduction: number;
  } | null>(null);

  const allInterventions = [...URBAN_INTERVENTIONS, ...RURAL_INTERVENTIONS];

  const handleSelectIntervention = (intervention: InterventionType) => {
    if (selectedInterventions.includes(intervention.id)) {
      setSelectedInterventions(prev => prev.filter(id => id !== intervention.id));
    } else {
      setSelectedInterventions(prev => [...prev, intervention.id]);
      onAddIntervention(intervention);
    }
  };

  const calculateImpact = () => {
    const selectedInterventionDetails = allInterventions.filter(
      intervention => selectedInterventions.includes(intervention.id)
    );

    const totalReductionMin = selectedInterventionDetails.reduce(
      (sum, intervention) => sum + intervention.estimatedReductionMin, 0
    );
    const totalReductionMax = selectedInterventionDetails.reduce(
      (sum, intervention) => sum + intervention.estimatedReductionMax, 0
    );

    const currentEmissions = city.emissions.current;
    const averageReduction = (totalReductionMin + totalReductionMax) / 2;
    const projectedEmissions = Math.max(0, currentEmissions - averageReduction);
    const percentageReduction = ((averageReduction / currentEmissions) * 100);

    const impact = {
      totalReductionMin,
      totalReductionMax,
      currentEmissions,
      projectedEmissions,
      percentageReduction
    };

    setCalculatedImpact(impact);
    
    if (onImpactCalculated) {
      onImpactCalculated({
        totalReductionMin,
        totalReductionMax,
        selectedCount: selectedInterventions.length
      });
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const interventions = activeTab === 'urban' ? URBAN_INTERVENTIONS : RURAL_INTERVENTIONS;

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Available Interventions</h3>
        <div className="text-sm text-gray-500">for {city.name}</div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('urban')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'urban'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          🌆 Urban Interventions
        </button>
        <button
          onClick={() => setActiveTab('rural')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'rural'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TreePine className="w-4 h-4" />
          🌾 Rural Interventions
        </button>
      </div>

      {/* Interventions List */}
      <div className="space-y-4">
        {interventions.map((intervention) => (
          <div
            key={intervention.id}
            className={`border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
              selectedInterventions.includes(intervention.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => handleSelectIntervention(intervention)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${
                selectedInterventions.includes(intervention.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {intervention.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{intervention.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(intervention.cost)}`}>
                      {intervention.cost} Cost
                    </span>
                    {selectedInterventions.includes(intervention.id) && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{intervention.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-green-700 font-medium">
                    Est. Reduction: {intervention.estimatedReductionMin.toFixed(1)}-{intervention.estimatedReductionMax.toFixed(1)} Gt/year
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedInterventions.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 mb-2">
                Selected Interventions ({selectedInterventions.length})
              </h4>
              <p className="text-green-700 text-sm">
                These interventions could reduce CO₂ emissions in {city.name} and contribute to global climate goals.
              </p>
            </div>
            <button
              onClick={calculateImpact}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Calculator className="w-4 h-4" />
              Calculate Impact
            </button>
          </div>

          {calculatedImpact && (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-6 h-6 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">Impact Analysis Results</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current vs Projected */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h5 className="font-semibold text-gray-900 mb-3">Emissions Comparison</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Emissions:</span>
                      <span className="font-semibold text-red-600">{calculatedImpact.currentEmissions.toFixed(1)} Gt</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projected Emissions:</span>
                      <span className="font-semibold text-green-600">{calculatedImpact.projectedEmissions.toFixed(1)} Gt</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium text-gray-700">Total Reduction:</span>
                      <span className="font-bold text-green-700">
                        {calculatedImpact.totalReductionMin.toFixed(1)}-{calculatedImpact.totalReductionMax.toFixed(1)} Gt/year
                      </span>
                    </div>
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h5 className="font-semibold text-gray-900 mb-3">Impact Metrics</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-2xl text-green-600">
                          {calculatedImpact.percentageReduction.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Reduction</div>
                      </div>
                    </div>
                    
                    {calculatedImpact.percentageReduction > 50 && (
                      <div className="flex items-center gap-2 p-2 bg-green-100 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          Excellent! This could achieve significant emission reductions.
                        </span>
                      </div>
                    )}
                    
                    {calculatedImpact.percentageReduction >= 20 && calculatedImpact.percentageReduction <= 50 && (
                      <div className="flex items-center gap-2 p-2 bg-amber-100 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800 font-medium">
                          Good progress! Consider adding more interventions.
                        </span>
                      </div>
                    )}
                    
                    {calculatedImpact.percentageReduction < 20 && (
                      <div className="flex items-center gap-2 p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-800 font-medium">
                          Consider selecting additional high-impact interventions.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline and Cost Analysis */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">5-10</div>
                    <div className="text-sm text-gray-600">Years to Full Impact</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{selectedInterventions.length}</div>
                    <div className="text-sm text-gray-600">Selected Interventions</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">Mixed</div>
                    <div className="text-sm text-gray-600">Investment Level</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};