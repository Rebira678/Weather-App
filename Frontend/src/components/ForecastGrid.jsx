import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';

export default function ForecastGrid({ forecastData }) {
  const { unit } = useWeatherStore();
  if (!forecastData || !forecastData.forecast) return null;

  const days = forecastData.forecast.forecastday;

  const getWeatherIcon = (condition) => {
    const text = condition.toLowerCase();
    if (text.includes('sunny') || text.includes('clear')) return <Sun className="w-8 h-8 text-yellow-400" />;
    if (text.includes('cloudy')) return <Cloud className="w-8 h-8 text-gray-400" />;
    if (text.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (text.includes('thunder')) return <CloudLightning className="w-8 h-8 text-purple-400" />;
    if (text.includes('snow')) return <CloudSnow className="w-8 h-8 text-white" />;
    return <Sun className="w-8 h-8 text-yellow-400" />;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const getDayNum = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {days.map((day, index) => (
        <div 
          key={day.date} 
          className="dashboard-card min-w-[160px] p-6 flex flex-col items-center justify-between text-center hover:bg-[#262626] transition-all cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-white font-black text-sm">{getDayName(day.date)} {getDayNum(day.date)}</p>
          </div>
          
          <div className="py-6 weather-icon-glow">
            {getWeatherIcon(day.day.condition.text)}
          </div>
          
          <div className="space-y-1">
            <p className="text-xl font-bold">
              {Math.round(unit === 'metric' ? day.day.maxtemp_c : day.day.maxtemp_f)}
              <span className="text-white/20">/{Math.round(unit === 'metric' ? day.day.mintemp_c : day.day.mintemp_f)}</span>
            </p>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{day.day.condition.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
