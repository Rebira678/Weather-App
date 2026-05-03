# WeatherAI - Real-Time Weather Intelligence

WeatherAI is a production-ready, full-stack weather application designed to provide users with comprehensive weather forecasts, interactive mapping, and contextual travel insights. Built with the MERN stack, it offers a premium user experience with real-time data and smart search capabilities.

## ⚡ Quick Start

To get the application running quickly:

1. **Backend**:
   ```bash
   cd Backend
   npm install
   # Ensure .env is configured
   npm start
   ```

2. **Frontend**:
   ```bash
   cd Frontend
   npm install
   # Ensure .env is configured
   npm run dev
   ```

## 🚀 Features
- **Real-Time Weather**: Instant access to current weather conditions for any city worldwide.
- **5-Day Forecast**: Detailed daily forecasts to help you plan ahead.
- **Interactive Maps**: Visualize locations using integrated Google Maps.
- **Smart Travel Insights**: Get AI-driven recommendations based on weather conditions.
- **YouTube Integration**: View relevant travel guides and videos for searched locations.
- **Search History**: Save and manage your search history with full CRUD support.
- **Data Export**: Export your search history to CSV for external analysis.
- **Responsive Design**: Fully optimized for mobile and desktop viewing.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Weather Data**: [OpenWeatherMap API](https://openweathermap.org/api) (Current & 5-Day Forecast)
- **Video Data**: [YouTube Data API v3](https://developers.google.com/youtube/v3) (Travel Guides)

## 📦 Project Structure

```text
Weather App/
├── Backend/            # Express API server
│   ├── src/
│   │   ├── config/     # Database and Env configurations
│   │   ├── controllers/# Request handlers
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # External API integrations
│   │   └── server.js   # Entry point
├── Frontend/           # React client
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── components/ # UI components
│   │   ├── store/      # Zustand stores
│   │   └── App.jsx     # Main application
└── README.md           # Project documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)
- API Keys:
  - [OpenWeatherMap API Key](https://home.openweathermap.org/api_keys) (Free tier)
  - [Google Maps API Key](https://console.cloud.google.com/google/maps-apis/)
  - [YouTube Data API Key](https://console.cloud.google.com/apis/library/youtube.googleapis.com)

### Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the following template:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/weather_app
   WEATHER_API_KEY=your_openweathermap_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   # Backend URL — no trailing slash
   # Local: http://localhost:5000/api
   # Production: https://weather-app-xfze.onrender.com/api
   VITE_API_URL=http://localhost:5000/api

   # Get from https://console.cloud.google.com/ (Maps JavaScript API)
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment Status

- **Frontend**: Deployed on [Vercel](https://weather-app-one-lilac-70.vercel.app)
- **Backend**: Deployed on [Render](https://weather-app-xfze.onrender.com)

> [!NOTE]
> The backend is hosted on Render's free tier. If the application hasn't been used recently, the backend may take 30-60 seconds to "spin up" (cold start). If the frontend doesn't show data immediately, please wait a moment or refresh the page.

## 🌐 Deployment Guide

### Backend (Render)
1. Create a new "Web Service" on Render.
2. Connect your GitHub repository.
3. Set the "Root Directory" to `Backend`.
4. Add the following Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `WEATHER_API_KEY`: Your OpenWeatherMap key.
   - `YOUTUBE_API_KEY`: Your YouTube API key.
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`).
   - `NODE_ENV`: `production`

### Frontend (Vercel)
1. Create a new project on Vercel.
2. Connect your GitHub repository.
3. Set the "Root Directory" to `Frontend`.
4. In "Build & Development Settings":
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add the following Environment Variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://weather-app-xfze.onrender.com/api`).
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key.

## 🛠️ Troubleshooting

### `vite: not found` Error
If you encounter `sh: 1: vite: not found` when running `npm run dev`, try the following:
1. Ensure you have run `npm install` in the `Frontend` directory.
2. If the error persists, try running:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. The project scripts have been updated to use explicit paths (`./node_modules/.bin/vite`) to help resolve environment-specific path issues.

### Backend Connection Issues
Ensure MongoDB is running and the `MONGO_URI` in `Backend/.env` is correct.

## 📄 License

This project is part of the PM Accelerator AI Engineer assessment.

