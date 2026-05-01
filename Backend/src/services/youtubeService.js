import axios from 'axios';
import env from '../config/env.js';

/**
 * Fetches a YouTube travel guide video for a specific city
 * @param {string} city - The city name
 */
export const getTravelGuideVideo = async (city) => {
  try {
    const query = `${city} travel guide`;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        key: env.youtubeApiKey || process.env.YOUTUBE_API_KEY,
        type: 'video',
        maxResults: 1
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return {
        videoId,
        title: response.data.items[0].snippet.title,
        url: `https://www.youtube.com/embed/${videoId}`
      };
    }
    return null; // No video found
  } catch (error) {
    console.error('[ YouTube Service Error ]', error.message);
    // We don't want to break the whole weather app if YouTube fails, so we return null
    return null;
  }
};
