import dotenv from 'dotenv';
dotenv.config();

const env = {
    port:process.env.PORT || 5000,
    nodeEnv:process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
};

if (!env.mongoUri){
    console.error("CRITICAL ERROR: MONGO_URI is not defined in .env file.");
    process.exit(1);
}

export default env;