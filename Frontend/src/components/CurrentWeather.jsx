import React from 'react';
import { Wind, Droplets, Sun, Cloud, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';

export default function CurrentWeather({ data }) {
  if (!data) return null;

  const { current, location } = data;

  const getWeatherIcon = (condition) => {
    const text = condition.toLowerCase();
    if (text.includes('sunny') || text.includes('clear')) return <Sun className="w-24 h-24 text-yellow-400" />;
    if (text.includes('cloudy')) return <Cloud className="w-24 h-24 text-gray-400" />;
    if (text.includes('rain')) return <CloudRain className="w-24 h-24 text-blue-400" />;
    if (text.includes('thunder')) return <CloudLightning className="w-24 h-24 text-purple-400" />;
    if (text.includes('snow')) return <CloudSnow className="w-24 h-24 text-white" />;
    return <Sun className="w-24 h-24 text-yellow-400" />;
  };

  return (
    <div className="dashboard-card relative p-10 overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
      
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black tracking-tight">{location.name}</h2>
            <p className="text-white/40 font-medium">{location.region}, {location.country}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[120px] font-black leading-none tracking-tighter tabular-nums">
              {Math.round(current.temp_c)}
            </span>
            <span className="text-4xl font-bold text-white/40">°C</span>
          </div>

          <div className="flex flex-wrap gap-8 pt-4">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Humidity</p>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="font-bold">{current.humidity}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Wind</p>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-green-400" />
                <span className="font-bold">{current.wind_kph} <span className="text-[10px] text-white/40 uppercase">km/h</span></span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Air Quality</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold uppercase text-xs text-green-400">Good</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end justify-center space-y-4">
          <div className="weather-icon-glow">
            {getWeatherIcon(current.condition.text)}
          </div>
          <div className="text-center md:text-right">
            <p className="text-3xl font-bold">{current.condition.text}</p>
            <p className="text-white/30 text-sm mt-1">Feels like {Math.round(current.feelslike_c)}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
}
