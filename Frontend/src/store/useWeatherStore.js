import { create } from 'zustand';
import { searchWeather as searchWeatherApi } from '../api';

export const useWeatherStore = create((set) => ({
  // State
  weatherData: null,
  travelGuide: null,
  loading: false,
  error: null,

  // Actions
  fetchWeather: async (query) => {
    set({ loading: true, error: null, weatherData: null, travelGuide: null });
    try {
      const response = await searchWeatherApi(query);
      set({
        weatherData: response.data.weather,
        travelGuide: response.data.travelGuide,
        loading: false,
      });
      return response.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  clearWeather: () => set({ weatherData: null, travelGuide: null, error: null }),
}));
