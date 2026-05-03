import app from '../Backend/src/app.js';
import connectDB from '../Backend/src/config/db.js';

// Connect to MongoDB (Vercel will reuse this connection across requests)
let cachedDb = null;

const handler = async (req, res) => {
  if (!cachedDb) {
    cachedDb = await connectDB();
  }
  return app(req, res);
};

export default handler;
