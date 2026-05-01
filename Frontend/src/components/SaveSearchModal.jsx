import { useState } from 'react';
import { BookmarkPlus, X, Calendar } from 'lucide-react';
import { useHistoryStore } from '../store/useHistoryStore';

export default function SaveSearchModal({ weatherData, onClose }) {
  const { addRecord } = useHistoryStore();
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { location, current } = weatherData;

  const handleSave = async () => {
    setSaving(true);
    try {
      await addRecord({
        locationName: `${location.name}, ${location.country}`,
        coordinates: { lat: location.lat, lon: location.lon },
        startDate,
        endDate,
        temperature: current.temp_c,
        weatherDescription: current.condition.text,
        unit: 'metric',
        notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 max-w-md w-full z-10 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
            <BookmarkPlus className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Save Search</h3>
            <p className="text-white/40 text-xs">{location.name}, {location.country}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-xs font-medium block mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field text-sm py-2"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-medium block mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field text-sm py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs font-medium block mb-1.5">
              Notes / Label (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Business trip, Vacation planning..."
              rows={3}
              className="input-field text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancel
          </button>
          <button
            id="confirm-save-btn"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? 'Saving...' : 'Save Search'}
          </button>
        </div>
      </div>
    </div>
  );
}
