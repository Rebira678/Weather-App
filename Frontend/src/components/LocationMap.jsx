import { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to update map view when lat/lon change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LocationMap({ lat, lon, cityName, compact = false }) {
  if (!lat || !lon) return null;

  const position = [parseFloat(lat), parseFloat(lon)];

  return (
    <div className={`dashboard-card overflow-hidden animate-slide-up ${compact ? 'h-full' : ''}`}>
      {!compact && (
        <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-[#2a2a2a] bg-[#1c1c1c]">
          <MapPin className="w-4 h-4 text-white/40" />
          <h3 className="text-white font-bold text-xs uppercase tracking-widest">{cityName}</h3>
          <span className="ml-auto text-white/20 text-[10px] font-mono">
            {parseFloat(lat).toFixed(4)}, {parseFloat(lon).toFixed(4)}
          </span>
        </div>
      )}
      <div className={`w-full ${compact ? 'h-full' : 'h-64'} relative z-0`}>
        <MapContainer 
          center={position} 
          zoom={11} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // Using a dark themed tile layer if possible, or sticking to standard
          />
          {/* Optional: Use a dark theme for the map tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <Marker position={position}>
            <Popup>
              <div className="text-black font-bold">{cityName}</div>
            </Popup>
          </Marker>
          <ChangeView center={position} zoom={11} />
        </MapContainer>
      </div>
    </div>
  );
}
