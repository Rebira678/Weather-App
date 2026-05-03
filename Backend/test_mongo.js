import mongoose from 'mongoose';
import env from './src/config/env.js';
import Weather from './src/models/Weather.js';

async function testMongo() {
  try {
    console.log('Connecting to', env.mongoUri);
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB Connected Successfully');
    const records = await Weather.find();
    console.log('Found records:', records.length);
    process.exit(0);
  } catch (error) {
    console.error('MongoDB Error:', error.message);
    process.exit(1);
  }
}

testMongo();
