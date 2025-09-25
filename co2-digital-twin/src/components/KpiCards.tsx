import React from 'react';
import { KpiCardData } from '@/types/dashboard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  data: KpiCardData;
}

export const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`${data.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-500`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium mb-2">{data.title}</h3>
          <p className="text-gray-900 text-3xl font-bold mb-1">{data.value}</p>
          <div className="flex items-center gap-2">
            {data.trend && getTrendIcon()}
            <p className={`text-sm font-medium ${data.trend ? getTrendColor() : 'text-gray-600'}`}>
              {data.subtitle}
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 rounded-xl opacity-5">
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-green-200"></div>
        <div className="absolute bottom-4 right-8 w-8 h-8 rounded-full bg-green-100"></div>
      </div>
    </div>
  );
};

interface KpiCardsProps {
  totalEmissions: number;
  changePercent: number;
  totalSaved: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ 
  totalEmissions, 
  changePercent, 
  totalSaved 
}) => {
  const kpiData: KpiCardData[] = [
    {
      title: 'CO₂ Emissions',
      value: `${totalEmissions.toFixed(1)} Gt`,
      subtitle: 'Total Global Emissions',
      color: 'bg-white relative overflow-hidden'
    },
    {
      title: 'Change Since Last Year',
      value: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
      subtitle: 'Year-over-year change',
      trend: changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'neutral',
      color: 'bg-white relative overflow-hidden'
    },
    {
      title: 'CO₂ Saved',
      value: `${totalSaved} Mt`,
      subtitle: 'Through green initiatives',
      trend: 'down',
      color: 'bg-white relative overflow-hidden'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {kpiData.map((data, index) => (
        <KpiCard key={index} data={data} />
      ))}
    </div>
  );
};