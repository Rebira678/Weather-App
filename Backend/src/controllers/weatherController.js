import { getWeatherData } from '../services/weatherService.js';
import { getTravelGuideVideo } from '../services/youtubeService.js';

// @desc    Get weather data and travel guide
// @route   GET /api/weather/search
// @access  Public
export const searchWeather = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      const err = new Error('Please provide a location (zip, city, or coordinates)');
      err.statusCode = 400;
      throw err;
    }

    // Fetch weather data
    const weatherData = await getWeatherData(q);

    // Fetch YouTube video (using the city name from weather data)
    const cityName = weatherData.location.name;
    const travelGuide = await getTravelGuideVideo(cityName);

    res.status(200).json({
      success: true,
      data: {
        weather: weatherData,
        travelGuide
      }
    });
  } catch (error) {
    next(error);
  }
};
