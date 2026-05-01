import React from 'react';
import { Lightbulb, Wind, Sun, Car } from 'lucide-react';

export default function SmartInsight({ weatherData }) {
  if (!weatherData) return null;

  const { current } = weatherData;
  const uv = current.uv;
  
  // Basic logic for insights
  const getUVStatus = (val) => {
    if (val <= 2) return { label: 'Low', color: 'text-green-400' };
    if (val <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
    if (val <= 7) return { label: 'High', color: 'text-orange-400' };
    return { label: 'Very High', color: 'text-red-400' };
  };

  const uvStatus = getUVStatus(uv);

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h3 className="text-white font-bold uppercase tracking-wider text-sm">AI Smart Insight</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl">
            <Sun className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">UV Index</p>
            <p className="text-white text-sm font-semibold">
              {uvStatus.label} <span className="text-white/30 ml-1">({uv})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl">
            <Wind className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Clothing</p>
            <p className="text-white text-sm font-semibold">
              {current.temp_c < 15 ? 'Heavy layers' : current.temp_c < 22 ? 'Light layer' : 'Summer wear'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 rounded-2xl">
            <Car className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Travel Planning</p>
            <p className="text-white text-sm font-semibold">
              Optimal travel planning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
