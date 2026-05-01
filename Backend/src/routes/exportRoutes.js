import express from 'express';
import Weather from '../models/Weather.js';
import { Parser } from 'json2csv';

const router = express.Router();

// @desc  Export history as JSON
// @route GET /api/export/json
router.get('/json', async (req, res, next) => {
  try {
    const records = await Weather.find().sort({ createdAt: -1 }).lean();
    const json = JSON.stringify(records, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=weather-history.json');
    res.status(200).send(json);
  } catch (err) {
    next(err);
  }
});

// @desc  Export history as CSV
// @route GET /api/export/csv
router.get('/csv', async (req, res, next) => {
  try {
    const records = await Weather.find().sort({ createdAt: -1 }).lean();

    const fields = [
      { label: 'Location', value: 'locationName' },
      { label: 'Latitude', value: 'coordinates.lat' },
      { label: 'Longitude', value: 'coordinates.lon' },
      { label: 'Start Date', value: 'startDate' },
      { label: 'End Date', value: 'endDate' },
      { label: 'Temperature (°C)', value: 'temperature' },
      { label: 'Description', value: 'weatherDescription' },
      { label: 'Unit', value: 'unit' },
      { label: 'Notes', value: 'notes' },
      { label: 'Saved At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=weather-history.csv');
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
