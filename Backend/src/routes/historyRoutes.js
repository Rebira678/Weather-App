import express from 'express';
import {
  createWeatherRecord,
  getWeatherRecords,
  updateWeatherRecord,
  deleteWeatherRecord
} from '../controllers/historyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all history routes

router.route('/')
  .post(createWeatherRecord)
  .get(getWeatherRecords);

router.route('/:id')
  .put(updateWeatherRecord)
  .delete(deleteWeatherRecord);

export default router;
