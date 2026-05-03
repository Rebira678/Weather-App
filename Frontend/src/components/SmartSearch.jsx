import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { getSuggestions } from '../api';

export default function SmartSearch({ onSearch, minimal = false }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { loading } = useWeatherStore();
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        setIsSearching(true);
        const response = await getSuggestions(query);
        setSuggestions(response.data);
      } catch (err) {
        console.error('Suggestions fetch failed:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    const locationStr = `${suggestion.name}, ${suggestion.country}`;
    setQuery(locationStr);
    onSearch(locationStr);
    setShowSuggestions(false);
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
        <div className="relative flex items-center bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl focus-within:border-white/20 transition-all">
          <div className="pl-4">
            <Search className="w-5 h-5 text-white/20" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter location, zip, or coordinates..."
            className="flex-1 bg-transparent py-3 px-3 text-white placeholder-white/20 focus:outline-none text-sm"
            disabled={loading}
          />
          {(showSuggestions && (suggestions.length > 0 || isSearching)) && (
            <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl z-50 animate-slide-up">
              {isSearching ? (
                <div className="px-4 py-3 flex items-center gap-3 text-white/40">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Searching...</span>
                </div>
              ) : suggestions.map((s, i) => (
                <button
                  key={`${s.lat}-${s.lon}-${i}`}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-white/20" />
                  <div>
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{s.state ? `${s.state}, ` : ''}{s.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
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
        <div className="relative flex items-center dashboard-card">
          <div className="pl-6 pr-3">
            <QueryIcon className="w-6 h-6 text-white/40" />
          </div>

          <input
            id="smart-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter city, zip code, or coordinates (lat, lon)..."
            className="flex-1 bg-transparent py-6 pr-4 text-white placeholder-white/20 focus:outline-none text-xl font-medium"
            disabled={loading}
          />

          {(showSuggestions && (suggestions.length > 0 || isSearching)) && (
            <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-4 bg-[#1c1c1c] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl z-50 animate-slide-up">
              {isSearching ? (
                <div className="px-8 py-5 flex items-center gap-4 text-white/40">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-bold uppercase tracking-widest">Finding locations...</span>
                </div>
              ) : suggestions.map((s, i) => (
                <button
                  key={`${s.lat}-${s.lon}-${i}`}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full px-8 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                >
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-lg font-bold text-white">{s.name}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{s.state ? `${s.state}, ` : ''}{s.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

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
