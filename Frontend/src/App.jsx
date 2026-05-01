import { useState } from 'react';
import { BookmarkPlus, CloudSun, AlertCircle, X, Search, User, LogOut, Menu, Settings, Download, Wind, Droplets, Map as MapIcon, Video, ChevronUp, FileJson, FileText } from 'lucide-react';
import { useWeatherStore } from './store/useWeatherStore';
import { exportJSON, exportCSV } from './api';
import SmartSearch from './components/SmartSearch';
import CurrentWeather from './components/CurrentWeather';
import ForecastGrid from './components/ForecastGrid';
import LocationMap from './components/LocationMap';
import TravelGuide from './components/TravelGuide';
import SearchHistory from './components/SearchHistory';
import SmartInsight from './components/SmartInsight';
import SaveSearchModal from './components/SaveSearchModal';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ErrorToast({ message, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-start gap-3 dashboard-card bg-red-500/10 border-red-500/20 p-4 max-w-sm animate-slide-up shadow-xl">
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <p className="text-white/80 text-sm flex-1">{message}</p>
      <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function App() {
  const { weatherData, travelGuide, loading, error, fetchWeather, clearError } = useWeatherStore();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSearch = async (query) => {
    try {
      await fetchWeather(query);
    } catch {
      // error is handled in store
    }
  };

  const handleExport = async (format) => {
    try {
      const blob = format === 'json' ? await exportJSON() : await exportCSV();
      downloadBlob(blob, `weather-history.${format}`);
      setShowExportMenu(false);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
        {/* Error Toast */}
        {error && <ErrorToast message={error} onClose={clearError} />}

        {/* Sidebar - Left */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-20'} flex flex-col border-r border-[#1a1a1a] bg-[#0a0a0a] transition-all duration-300 z-40`}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Wind className="w-6 h-6 text-black" />
            </div>
            {sidebarOpen && <h1 className="font-black text-xl tracking-tighter uppercase">Weather Flow</h1>}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
            {sidebarOpen && (
              <div className="mb-8">
                <SearchHistory hideHeader />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#1a1a1a] relative">
            {sidebarOpen ? (
              <>
                {showExportMenu && (
                  <div className="absolute bottom-20 left-6 right-6 bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
                    <button 
                      onClick={() => handleExport('json')}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      <FileJson className="w-4 h-4" /> Export as JSON
                    </button>
                    <button 
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest border-t border-[#2a2a2a]"
                    >
                      <FileText className="w-4 h-4" /> Export as CSV
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="w-full btn-dark flex items-center justify-center gap-2 group"
                >
                  <Download className="w-4 h-4" />
                  <span className="flex-1 text-left">EXPORT</span>
                  <ChevronUp className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                </button>
              </>
            ) : (
              <button className="w-full flex justify-center text-white/40 hover:text-white">
                <Download className="w-6 h-6" />
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-20 border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md">
            <div className="flex-1 max-w-2xl">
              <SmartSearch onSearch={handleSearch} minimal />
            </div>

            <div className="flex items-center gap-6 ml-8">
              <button className="text-white/40 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
              </div>
            </div>
          </header>

          {/* Dashboard Scroll Area */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {!weatherData && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
                <div className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Wind className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-5xl font-black tracking-tight leading-tight">
                  Enter a location to start <span className="text-white/20">your flow.</span>
                </h2>
                <p className="text-white/40 text-lg">
                  Real-time weather intelligence with AI insights and hyper-local travel guides.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-8 animate-pulse">
                <div className="dashboard-card h-80 bg-white/5" />
                <div className="dashboard-card h-40 bg-white/5" />
                <div className="flex gap-4 overflow-hidden">
                   {[...Array(5)].map((_, i) => <div key={i} className="dashboard-card min-w-[160px] h-48 bg-white/5" />)}
                </div>
              </div>
            )}

            {weatherData && !loading && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left & Middle Column (8 cols) */}
                <div className="xl:col-span-8 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest">Current Weather</h3>
                    <button 
                      onClick={() => setShowSaveModal(true)}
                      className="text-xs font-bold text-white hover:underline underline-offset-4"
                    >
                      SAVE TO HISTORY
                    </button>
                  </div>
                  
                  <CurrentWeather data={weatherData} />
                  <SmartInsight weatherData={weatherData} />
                  
                  <div className="space-y-4">
                    <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest">5-Day Forecast</h3>
                    <ForecastGrid forecastData={weatherData} />
                  </div>
                </div>

                {/* Right Column (4 cols) */}
                <div className="xl:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapIcon className="w-4 h-4 text-white/40" />
                      <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest">Location View</h3>
                    </div>
                    <div className="dashboard-card aspect-square">
                      <LocationMap
                        lat={weatherData.location.lat}
                        lon={weatherData.location.lon}
                        cityName={weatherData.location.name}
                        compact
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-white/40" />
                      <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest">Travel Guide</h3>
                    </div>
                    <TravelGuide travelGuide={travelGuide} />
                  </div>
                </div>
              </div>
            )}
          </main>

          <Footer />
        </div>

        {/* Save Modal */}
        {showSaveModal && weatherData && (
          <SaveSearchModal
            weatherData={weatherData}
            onClose={() => setShowSaveModal(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
