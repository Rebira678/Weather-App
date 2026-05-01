import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMapsScript(callback) {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  if (document.getElementById('google-maps-script')) {
    document.getElementById('google-maps-script').addEventListener('load', callback);
    return;
  }
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}

export default function LocationMap({ lat, lon, cityName }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!lat || !lon) return;

    loadGoogleMapsScript(() => {
      if (!mapRef.current || !window.google) return;

      const center = { lat: parseFloat(lat), lng: parseFloat(lon) };

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 11,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f1a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });

      new window.google.maps.Marker({
        position: center,
        map,
        title: cityName,
      });
    });
  }, [lat, lon, cityName]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center gap-2 h-48 text-white/30">
        <MapPin className="w-8 h-8" />
        <p className="text-sm">Add VITE_GOOGLE_MAPS_API_KEY to enable interactive map</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
        <MapPin className="w-4 h-4 text-primary-400" />
        <h3 className="text-white font-semibold text-sm">{cityName}</h3>
        <span className="ml-auto text-white/30 text-xs">
          {parseFloat(lat).toFixed(4)}, {parseFloat(lon).toFixed(4)}
        </span>
      </div>
      <div ref={mapRef} className="w-full h-52 md:h-64" />
    </div>
  );
}
