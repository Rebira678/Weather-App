import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import weatherRoutes from './routes/weatherRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Global middleware
//security headers
app.use(helmet());

// Enable CORS — allow the Vite dev server and any production frontend
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN 
    ? process.env.CLIENT_ORIGIN.replace(/\/$/, '') 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

//parse incoming JSON payloads
app.use(express.json());

//parse URL-encoded payloads
app.use(express.urlencoded({extended:true}));

//request logging (only in development)
if (process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}

// Apply rate limiting to all /api routes
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/export', exportRoutes);

// Health check route
app.get('/api/health',(req,res)=>{
    res.status(200).json({
        status:"success",
        message:'Weather API is running flawlessly.',
        timestamp: new Date().toISOString()
    });
});

// Global error handler should be the last middleware
app.use(globalErrorHandler);

export default app;