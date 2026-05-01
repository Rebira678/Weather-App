import express from 'express';
import {
  createWeatherRecord,
  getWeatherRecords,
  updateWeatherRecord,
  deleteWeatherRecord
} from '../controllers/historyController.js';

const router = express.Router();

router.route('/')
  .post(createWeatherRecord)
  .get(getWeatherRecords);

router.route('/:id')
  .put(updateWeatherRecord)
  .delete(deleteWeatherRecord);

export default router;
