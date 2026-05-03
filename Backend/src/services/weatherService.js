import axios from 'axios';
import env from '../config/env.js';

/**
 * Fetches weather data from OpenWeatherMap and transforms it to match the expected format
 * @param {string} location - City name
 */
export const getWeatherData = async (location) => {
  const apiKey = env.weatherApiKey || process.env.WEATHER_API_KEY;

  try {
    const params = {
      appid: apiKey,
      units: 'metric'
    };

    // Check if location is coordinates (e.g., "40.7128,-74.0060")
    if (location.includes(',') && !isNaN(parseFloat(location.split(',')[0]))) {
      const [lat, lon] = location.split(',');
      params.lat = lat.trim();
      params.lon = lon.trim();
    } else {
      params.q = location;
    }

    // Fetch Current Weather
    const currentResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params });

    // Fetch 5-Day Forecast (3-hour steps)
    const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', { params });

    return transformOWMData(currentResponse.data, forecastResponse.data);
  } catch (error) {
    console.error('[ WEATHER SERVICE ERROR ]', error.response?.data || error.message);

    const isApiKeyError = error.response?.status === 401;
    if (isApiKeyError) {
      console.warn('[ WEATHER SERVICE ] Invalid API Key. Returning mock data.');
    }

    if (error.response?.status === 404) {
      const err = new Error('City not found');
      err.statusCode = 404;
      throw err;
    }

    // Fallback to dynamic mock data
    return getMockWeatherData(location);
  }
};

/**
 * Transforms OpenWeatherMap data to the expected format
 */
const transformOWMData = (current, forecast) => {
  // Extract daily forecasts (taking one entry per day, e.g., at 12:00)
  const dailyForecasts = [];
  const seenDates = new Set();
  
  forecast.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!seenDates.has(date) && dailyForecasts.length < 5) {
      seenDates.add(date);
      dailyForecasts.push({
        date: date,
        day: {
          maxtemp_c: item.main.temp_max,
          mintemp_c: item.main.temp_min,
          condition: {
            text: item.weather[0].description,
            icon: `//openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
          }
        }
      });
    }
  });

  return {
    location: {
      name: current.name,
      region: '', // OWM doesn't provide region easily in this endpoint
      country: current.sys.country,
      lat: current.coord.lat,
      lon: current.coord.lon,
      localtime: new Date().toISOString()
    },
    current: {
      temp_c: current.main.temp,
      condition: {
        text: current.weather[0].description,
        icon: `//openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
      },
      wind_kph: current.wind.speed * 3.6, // m/s to kph
      humidity: current.main.humidity,
      feelslike_c: current.main.feels_like,
      uv: 0, // OWM basic API doesn't provide UV
      precip_mm: current.rain ? current.rain['1h'] || 0 : 0
    },
    forecast: {
      forecastday: dailyForecasts
    }
  };
};

/**
 * Returns dynamic mock weather data based on location name
 */
const getMockWeatherData = (location) => {
  // Simple hash for pseudo-random but consistent values
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tempBase = 15 + (hash % 15); // 15-30 range
  
  return {
    location: {
      name: location || 'London',
      region: 'Mock Region',
      country: 'Mock Country',
      lat: 0,
      lon: 0,
      localtime: new Date().toISOString()
    },
    current: {
      temp_c: tempBase,
      condition: {
        text: hash % 2 === 0 ? 'Sunny' : 'Cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
      },
      wind_kph: 10 + (hash % 10),
      humidity: 50 + (hash % 30),
      feelslike_c: tempBase - 2,
      uv: 5.0,
      precip_mm: 0.0
    },
    forecast: {
      forecastday: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        day: {
          maxtemp_c: tempBase + 2,
          mintemp_c: tempBase - 5,
          condition: { 
            text: (hash + i) % 2 === 0 ? 'Sunny' : 'Partly Cloudy',
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' 
          }
        }
      }))
    }
  };
};

/**
 * Fetches location suggestions (Geocoding)
 */
export const getLocationSuggestions = async (query) => {
  const apiKey = env.weatherApiKey || process.env.WEATHER_API_KEY;
  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: apiKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('[ GEO SERVICE ERROR ]', error.message);
    return [];
  }
};
