import { create } from 'zustand';
import { searchWeather as searchWeatherApi } from '../api';

export const useWeatherStore = create((set) => ({
  // State
  weatherData: null,
  travelGuide: null,
  loading: false,
  error: null,
  unit: 'metric', // 'metric' or 'imperial'
  recentSearches: JSON.parse(localStorage.getItem('recent_searches') || '[]'),

  // Actions
  fetchWeather: async (query) => {
    set({ loading: true, error: null, weatherData: null, travelGuide: null });
    try {
      const response = await searchWeatherApi(query);
      set((state) => {
        // Update recent searches
        const locationName = response.data.weather.location.name;
        const filtered = state.recentSearches.filter(s => s !== locationName);
        const newRecent = [locationName, ...filtered].slice(0, 5);
        localStorage.setItem('recent_searches', JSON.stringify(newRecent));

        return {
          weatherData: response.data.weather,
          travelGuide: response.data.travelGuide,
          recentSearches: newRecent,
          loading: false,
        };
      });
      return response.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  clearWeather: () => set({ weatherData: null, travelGuide: null, error: null }),
  toggleUnit: () => set((state) => ({ unit: state.unit === 'metric' ? 'imperial' : 'metric' })),
  clearRecent: () => {
    localStorage.removeItem('recent_searches');
    set({ recentSearches: [] });
  }
}));
