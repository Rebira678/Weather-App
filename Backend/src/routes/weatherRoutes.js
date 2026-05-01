import express from 'express';
import { searchWeather } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/search', searchWeather);

export default router;
