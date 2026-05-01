import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  coordinates: {
    lat: Number,
    lon: Number
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    // Custom validation: End date cannot be before Start date
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  temperature: {
    type: Number,
    required: true
  },
  weatherDescription: String,
  unit: {
    type: String,
    enum: ['metric', 'imperial'],
    default: 'metric'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Weather = mongoose.model('Weather', weatherSchema);
export default Weather;