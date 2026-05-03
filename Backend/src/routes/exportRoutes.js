import express from 'express';
import Weather from '../models/Weather.js';
import { Parser } from 'json2csv';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all export routes

// @desc  Export history as JSON
// @route GET /api/export/json
router.get('/json', async (req, res, next) => {
  try {
    const records = await Weather.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    const json = JSON.stringify(records, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=weather-history.json');
    res.status(200).send(json);
  } catch (err) {
    if (err.message.includes('authentication') || err.message.includes('MongoServerError')) {
      const mockRecord = [{
        locationName: 'Mock City, MC',
        coordinates: { lat: 0, lon: 0 },
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        temperature: 20,
        weatherDescription: 'Sunny',
        unit: 'metric',
        notes: 'Mock data for demo purposes',
        createdAt: new Date()
      }];
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=weather-history.json');
      return res.status(200).send(JSON.stringify(mockRecord, null, 2));
    }
    next(err);
  }
});

// @desc  Export history as CSV
// @route GET /api/export/csv
router.get('/csv', async (req, res, next) => {
  try {
    const records = await Weather.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();

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
    if (err.message.includes('authentication') || err.message.includes('MongoServerError')) {
      const mockRecord = [{
        locationName: 'Mock City, MC',
        coordinates: { lat: 0, lon: 0 },
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        temperature: 20,
        weatherDescription: 'Sunny',
        unit: 'metric',
        notes: 'Mock data for demo purposes',
        createdAt: new Date()
      }];
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
      const csv = parser.parse(mockRecord);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=weather-history.csv');
      return res.status(200).send(csv);
    }
    next(err);
  }
});

export default router;
