import { useState, useEffect, useRef } from 'react';
import { BookmarkPlus, CloudSun, AlertCircle, X, Search, User, LogOut, Menu, Settings, Download, Wind, Droplets, Map as MapIcon, Video, ChevronUp, FileJson, FileText, Clock, Edit2, Check } from 'lucide-react';
import { useWeatherStore } from './store/useWeatherStore';
import { useAuthStore } from './store/useAuthStore';
import { useHistoryStore } from './store/useHistoryStore';
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
import Auth from './pages/Auth';

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
  const { weatherData, travelGuide, loading: weatherLoading, error: weatherError, fetchWeather, clearError, unit, toggleUnit } = useWeatherStore();
  const { user, isAuthenticated, loading: authLoading, checkAuth, logout } = useAuthStore();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const { updateName } = useAuthStore();
  const { records, selectedIds, fetchHistory, addRecord: addHistoryRecord, clearSelection } = useHistoryStore();
  const [exportError, setExportError] = useState(null);
  
  // Refs for click outside
  const exportMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  // Click outside handler for menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    try {
      const response = await fetchWeather(query);
      
      // Automatically add to persistent history if authenticated
      if (isAuthenticated && response?.weather) {
        const weather = response.weather;
        addHistoryRecord({
          locationName: `${weather.location.name}, ${weather.location.country}`,
          coordinates: { lat: weather.location.lat, lon: weather.location.lon },
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          temperature: weather.current.temp_c,
          weatherDescription: weather.current.condition.text,
          unit: 'metric',
          notes: 'Automatic history record'
        });
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // Automatic Location Detection on Mount
  useEffect(() => {
    const fetchByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city) {
          console.log("IP Geolocation detected:", data.city);
          handleSearch(data.city);
        } else {
          throw new Error("Invalid IP geo response");
        }
      } catch (err) {
        console.warn("IP Geolocation failed:", err.message);
        handleSearch("London"); // Last resort
      }
    };

    const detectLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Pass coordinates to search
              await handleSearch(`${latitude},${longitude}`);
            } catch (err) {
              fetchByIP();
            }
          },
          (error) => {
            console.warn("Geolocation permission denied or failed:", error.message);
            fetchByIP();
          },
          { timeout: 5000 }
        );
      } else {
        fetchByIP();
      }
    };

    if (!weatherData && !weatherLoading) {
      detectLocation();
    }
  }, []);

  const handleExport = (format) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setShowExportMenu(false);
      return;
    }
    
    // Determine which records to export
    const exportRecords = selectedIds.length > 0 
      ? records.filter(r => selectedIds.includes(r._id))
      : records;
    
    if (exportRecords.length === 0) {
      setExportError("Please select at least one record to export, or save a location to your history first.");
      setShowExportMenu(false);
      setTimeout(() => setExportError(null), 5000);
      return;
    }

    try {
      let content;
      let type;
      let filename = selectedIds.length > 0 
        ? `weather-history-selected.${format}` 
        : `weather-history-all.${format}`;

      if (format === 'json') {
        content = JSON.stringify(exportRecords, null, 2);
        type = 'application/json';
      } else {
        // Simple CSV generation
        const headers = ['Location', 'Temp (°C)', 'Description', 'Start Date', 'End Date', 'Notes'];
        const rows = exportRecords.map(r => [
          r.locationName,
          r.temperature,
          r.weatherDescription,
          r.startDate,
          r.endDate,
          r.notes || ''
        ]);
        content = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        type = 'text/csv';
      }

      const blob = new Blob([content], { type });
      downloadBlob(blob, filename);
      setShowExportMenu(false);
      
      // Clear selection after successful export if they used selection
      if (selectedIds.length > 0) clearSelection();
    } catch (err) {
      console.error('Export failed:', err);
      setExportError("Export failed. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
        {/* Error Toast */}
        {weatherError && <ErrorToast message={weatherError} onClose={clearError} />}
        {exportError && <ErrorToast message={exportError} onClose={() => setExportError(null)} />}

        {/* Sidebar Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Drawer - Fixed Slide-over */}
        <aside className={`fixed left-0 top-0 bottom-0 z-40 w-80 bg-[#0a0a0a] border-r border-[#1a1a1a] transition-transform duration-500 ease-in-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Wind className="w-6 h-6 text-black" />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase">Weather Flow</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
            <div className="mb-8">
              <SearchHistory hideHeader />
            </div>
          </div>

          <div className="p-6 border-t border-[#1a1a1a] relative" ref={exportMenuRef}>
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
              className={`w-full flex items-center justify-center gap-2 group p-4 rounded-2xl border transition-all ${selectedIds.length > 0 ? 'bg-primary-500 border-primary-400 text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'btn-dark'}`}
            >
              <Download className="w-4 h-4" />
              <span className="flex-1 text-left text-[10px] font-black uppercase tracking-widest">
                {selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export All'}
              </span>
              <ChevronUp className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-20 border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md z-50">
            <div className="flex-1 max-w-2xl">
              <SmartSearch onSearch={handleSearch} minimal />
            </div>

            <div className="flex items-center gap-4 ml-8">
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true);
                  } else {
                    setSidebarOpen(true);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white"
                title="View History"
              >
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">History</span>
              </button>

              <button 
                onClick={toggleUnit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white"
                title="Toggle Unit (Celsius/Fahrenheit)"
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">
                  {unit === 'metric' ? '°C' : '°F'}
                </span>
              </button>
              
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                    } else {
                      setShowProfileMenu(!showProfileMenu);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center overflow-hidden hover:border-white/20 transition-colors"
                >
                   {isAuthenticated ? (
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt="User" className="w-full h-full" />
                   ) : (
                     <User className="w-5 h-5 text-white/60" />
                   )}
                </button>
                
                {showProfileMenu && isAuthenticated && (
                  <div className="absolute top-14 right-0 w-64 bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl animate-slide-up z-[100]">
                    <div className="px-4 py-3 border-b border-[#2a2a2a]">
                      <div className="flex flex-col items-center mb-4 py-2">
                        <div className="relative group">
                          <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center overflow-hidden mb-2">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed || user?.name || 'WeatherExplorer'}`} alt="User" className="w-full h-full" />
                          </div>
                          <button 
                            onClick={() => {
                              const newSeed = Math.random().toString(36).substring(7);
                              updateName(user?.name, newSeed); // I'll update the store action signature
                            }}
                            className="absolute bottom-2 right-0 p-1.5 bg-primary-500 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Change Avatar"
                          >
                            <Settings className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        {isEditingName ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="text"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-sm text-white w-full focus:outline-none focus:border-primary-500"
                              autoFocus
                            />
                            <button 
                              onClick={() => {
                                updateName(tempName);
                                setIsEditingName(false);
                              }}
                              className="p-1 text-green-400 hover:bg-white/5 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-white truncate flex-1">{user?.name}</p>
                            <button 
                              onClick={() => {
                                setTempName(user?.name || '');
                                setIsEditingName(true);
                              }}
                              className="p-1 text-white/40 hover:text-white rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        setIsEditingName(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest text-red-400"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Dashboard Scroll Area */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {!weatherData && !weatherLoading && (
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

            {weatherLoading && (
              <div className="space-y-8 animate-pulse">
                <div className="dashboard-card h-80 bg-white/5" />
                <div className="dashboard-card h-40 bg-white/5" />
                <div className="flex gap-4 overflow-hidden">
                   {[...Array(5)].map((_, i) => <div key={i} className="dashboard-card min-w-[160px] h-48 bg-white/5" />)}
                </div>
              </div>
            )}

            {weatherData && !weatherLoading && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left & Middle Column (8 cols) */}
                <div className="xl:col-span-8 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest">Current Weather</h3>
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          setShowAuthModal(true);
                        } else {
                          setShowSaveModal(true);
                        }
                      }}
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
        {showSaveModal && weatherData && isAuthenticated && (
          <SaveSearchModal
            weatherData={weatherData}
            onClose={() => setShowSaveModal(false)}
          />
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <Auth 
            onClose={() => setShowAuthModal(false)} 
            onSuccess={() => setShowAuthModal(false)} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
