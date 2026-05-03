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
- **Weather Data**: WeatherAPI.com
- **Video Data**: YouTube Data API v3

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
  - [WeatherAPI Key](https://www.weatherapi.com/)
  - [Google Maps API Key](https://console.cloud.google.com/)
  - [YouTube Data API Key](https://console.cloud.google.com/)

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
   WEATHER_API_KEY=your_key_here
   YOUTUBE_API_KEY=your_key_here
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
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

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

