import Weather from '../models/Weather.js';

// @desc    Create a new weather record
// @route   POST /api/weather
// @access  Public
export const createWeatherRecord = async (req, res, next) => {
  try {
    const { locationName, coordinates, startDate, endDate, temperature, weatherDescription, unit, notes } = req.body;

    const weatherRecord = new Weather({
      locationName,
      coordinates,
      startDate,
      endDate,
      temperature,
      weatherDescription,
      unit,
      notes
    });

    const createdRecord = await weatherRecord.save();
    res.status(201).json({
      status: 'success',
      data: createdRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all weather records
// @route   GET /api/weather
// @access  Public
export const getWeatherRecords = async (req, res, next) => {
  try {
    const records = await Weather.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a weather record (e.g., notes/labels)
// @route   PUT /api/weather/:id
// @access  Public
export const updateWeatherRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const record = await Weather.findById(id);

    if (!record) {
      const err = new Error('Record not found');
      err.statusCode = 404;
      throw err;
    }

    // Currently, mainly allowing notes update
    if (notes !== undefined) {
        record.notes = notes;
    }
    
    // We can also allow updating other fields if needed, but notes is primary update case
    const updatedRecord = await record.save();

    res.status(200).json({
      status: 'success',
      data: updatedRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a weather record
// @route   DELETE /api/weather/:id
// @access  Public
export const deleteWeatherRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const record = await Weather.findById(id);

    if (!record) {
      const err = new Error('Record not found');
      err.statusCode = 404;
      throw err;
    }

    await record.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Record removed'
    });
  } catch (error) {
    next(error);
  }
};
