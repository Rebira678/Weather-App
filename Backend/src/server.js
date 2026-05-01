import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        app.listen(env.port, () => {
            console.log(`[ SERVER ] Running in ${env.nodeEnv} mode`);
            console.log(`[ SERVER ] Listening on port ${env.port}`);
            console.log(`[ SERVER ] Health check: http://localhost:${env.port}/api/health`);
        });
    } catch (error) {
        console.error(`[ SERVER ERROR ] Failed to start:`, error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections (Senior level error handling)
process.on('unhandledRejection', (err) => {
  console.log('[ UNHANDLED REJECTION ] Shutting down securely...');
  console.log(err.name, err.message);
  process.exit(1);
});
