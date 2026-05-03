import axios from 'axios';
import env from '../config/env.js';

export const getTravelGuideVideo = async (cityName) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: `${cityName} travel guide 2024`,
                key: env.youtubeApiKey,
                maxResults: 3,
                type: 'video',
                videoEmbeddable: 'true'
            }
        });

        if (!response.data.items || response.data.items.length === 0) return null;

        const video = response.data.items[0];
        return {
            videoId: video.id.videoId,
            url: `https://www.youtube.com/embed/${video.id.videoId}`,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high.url,
            channelTitle: video.snippet.channelTitle
        };
    } catch (error) {
        console.error('[ YOUTUBE SERVICE ERROR ]', error.response?.data || error.message);
        return null;
    }
};
