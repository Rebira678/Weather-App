import express from 'express';
import { searchWeather, getSuggestions } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/search', searchWeather);
router.get('/suggestions', getSuggestions);

export default router;
