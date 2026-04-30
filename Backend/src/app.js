import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Global middleware
//security headers
app.use(helmet());

//enable cross -origin Resource Sharing
app.use(cors());

//parse incoming JSON payloads
app.use(express.json());

//parse URL-encoded payloads
app.use(express.urlencoded({extended:true}));

//request logging (only in development)
if (process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}

// Health check route
app.get('/api/health',(req,res)=>{
    res.status(200).json({
        status:"success",
        message:'Weather API is running flawlessly.',
        timestamp: new Date().toISOString()
    });
});

export default app;