import { useState } from 'react';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';

export default function SmartSearch({ onSearch, minimal = false }) {
  const [query, setQuery] = useState('');
  const { loading } = useWeatherStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  const getQueryType = (q) => {
    if (/^\d{5}(-\d{4})?$/.test(q)) return { type: 'zip', icon: MapPin };
    if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(q)) return { type: 'coords', icon: Navigation };
    return { type: 'city', icon: Search };
  };

  const { icon: QueryIcon, type } = getQueryType(query);

  if (minimal) {
    return (
      <form onSubmit={handleSubmit} className="w-full relative">
        <div className="relative flex items-center bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl overflow-hidden focus-within:border-white/20 transition-all">
          <div className="pl-4">
            <Search className="w-5 h-5 text-white/20" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter location, zip, or coordinates..."
            className="flex-1 bg-transparent py-3 px-3 text-white placeholder-white/20 focus:outline-none text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white/80 text-[10px] font-bold px-4 py-1.5 rounded-xl m-1.5 transition-all uppercase tracking-wider"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'New Search'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="relative flex items-center dashboard-card overflow-hidden">
          <div className="pl-6 pr-3">
            <QueryIcon className="w-6 h-6 text-white/40" />
          </div>

          <input
            id="smart-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city, zip code, or coordinates (lat, lon)..."
            className="flex-1 bg-transparent py-6 pr-4 text-white placeholder-white/20 focus:outline-none text-xl font-medium"
            disabled={loading}
          />

          <button
            id="search-submit-btn"
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary m-3 flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
