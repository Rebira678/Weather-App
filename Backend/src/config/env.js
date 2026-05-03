import dotenv from 'dotenv';
dotenv.config();

const env = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
    weatherApiKey: process.env.WEATHER_API_KEY,
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    jwtSecret: process.env.JWT_SECRET || 'secret-key-for-dev',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '90d'
};

if (!env.mongoUri) {
    console.error('CRITICAL ERROR: MONGO_URI is not defined in .env file.');
    process.exit(1);
}
if (!env.weatherApiKey) {
    console.warn('WARNING: WEATHER_API_KEY is not set. Weather search will fail.');
}
if (!env.youtubeApiKey) {
    console.warn('WARNING: YOUTUBE_API_KEY is not set. Travel guide will be unavailable.');
}

export default env;