import axios from 'axios';
import env from '../config/env.js';

/**
 * Fetches weather data and 5-day forecast from WeatherAPI
 * @param {string} location - Zip, City, or Coordinates
 */
export const getWeatherData = async (location) => {
  try {
    // WeatherAPI Forecast endpoint returns both current and forecast data
    const response = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: env.weatherApiKey || process.env.WEATHER_API_KEY,
        q: location,
        days: 5,
        aqi: 'no',
        alerts: 'no'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const err = new Error('City not found or invalid location');
      err.statusCode = 404;
      throw err;
    }
    const err = new Error('Failed to fetch weather data');
    err.statusCode = 502;
    throw err;
  }
};
