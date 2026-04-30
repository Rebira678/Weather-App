import app from './app.js';
import env from './config/env.js';

const startServer = async () => {
    try {
        // Change "PerformanceEventTiming.prototype" to "env.port"
        app.listen(env.port, () => {
            console.log(`[ SERVER ] Running in ${env.nodeEnv} mode`); // Fixed backticks here too
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
