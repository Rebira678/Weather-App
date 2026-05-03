import { useState, useEffect } from 'react';
import { Trash2, Pencil, Check, X, Clock, MapPin, FileJson, FileText, Edit2 } from 'lucide-react';
import { useHistoryStore } from '../store/useHistoryStore';
import { useWeatherStore } from '../store/useWeatherStore';
import { exportJSON, exportCSV } from '../api';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SearchHistory({ hideHeader = false }) {
  const { records, selectedIds, loading, fetchHistory, updateRecord, removeRecord, removeSelected, toggleSelection, selectAll, clearSelection } = useHistoryStore();
  const { recentSearches, fetchWeather, clearRecent } = useWeatherStore();
  const [editingId, setEditingId] = useState(null);
  const [noteValue, setNoteValue] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleEditStart = (record) => {
    setEditingId(record._id);
    setNoteValue(record.notes || '');
  };

  const handleEditSave = async (id) => {
    await updateRecord(id, { notes: noteValue });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this weather record?')) {
      await removeRecord(id);
    }
  };

  const isAllSelected = records.length > 0 && selectedIds.length === records.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  return (
    <div className={`${hideHeader ? '' : 'dashboard-card p-6'} animate-fade-in`}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Saved Locations</h2>
            <p className="text-white/40 text-xs font-bold mt-1 uppercase tracking-widest">{records.length} records</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              disabled={records.length === 0}
              className="btn-dark flex items-center gap-2 text-xs uppercase font-bold disabled:opacity-30"
            >
              JSON
            </button>
            <button
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="btn-dark flex items-center gap-2 text-xs uppercase font-bold disabled:opacity-30"
            >
              CSV
            </button>
          </div>
        </div>
      )}

      {hideHeader && (
        <div className="space-y-6">
           {/* Recent Searches Section */}
           {recentSearches.length > 0 && (
             <div>
               <div className="mb-3 px-2 flex items-center justify-between">
                 <h3 className="text-white/40 text-[10px] uppercase font-black tracking-widest">Recent Searches</h3>
                 <button 
                  onClick={clearRecent}
                  className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors"
                >
                  Clear
                </button>
               </div>
               <div className="flex flex-wrap gap-2 px-2">
                 {recentSearches.map((city) => (
                   <button
                     key={city}
                     onClick={() => fetchWeather(city)}
                     className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest"
                   >
                     {city}
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Saved Locations Section */}
           <div>
             <div className="mb-4 flex items-center justify-between px-2">
                <h3 className="text-white/40 text-[10px] uppercase font-black tracking-widest">Saved Locations ({records.length})</h3>
                <div className="flex items-center gap-3">
                  {selectedIds.length > 0 && (
                    <button 
                      onClick={() => {
                        if (window.confirm(`Delete ${selectedIds.length} selected items?`)) {
                          removeSelected();
                        }
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete ({selectedIds.length})
                    </button>
                  )}
                  <button 
                    onClick={handleSelectAll}
                    className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400"
                  >
                    {isAllSelected ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Records */}
      {loading ? (
        <div className="text-center py-12 text-white/30 text-xs font-bold uppercase tracking-widest">Updating flow...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-white/5 rounded-3xl">
          <Clock className="w-8 h-8 text-white/5 mx-auto mb-3" />
          <p className="text-white/20 text-[10px] uppercase font-black tracking-widest leading-relaxed">No history detected.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {records.map((record) => (
            <li
              key={record._id}
              className={`dashboard-card-hover p-4 group ${selectedIds.includes(record._id) ? 'border-primary-500/50 bg-primary-500/5' : ''}`}
            >
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => toggleSelection(record._id)}
                  className={`mt-1 w-4 h-4 rounded border transition-colors flex items-center justify-center ${selectedIds.includes(record._id) ? 'bg-primary-500 border-primary-500' : 'border-white/10 hover:border-white/20'}`}
                >
                  {selectedIds.includes(record._id) && <Check className="w-3 h-3 text-white" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                     <span className="text-white text-sm font-bold truncate leading-none">
                        {record.locationName}
                     </span>
                  </div>
                  <p className="text-white/40 text-[10px] mt-2 font-medium">
                    {record.weatherDescription} • {Math.round(record.temperature)}°C
                  </p>
                  
                  {editingId === record._id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        className="bg-[#0a0a0a] border border-[#3a3a3a] rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSave(record._id)}
                        autoFocus
                      />
                      <button onClick={() => handleEditSave(record._id)} className="text-green-400"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingId(null)} className="text-white/40"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    record.notes && (
                      <p className="text-white/30 text-[10px] mt-1 font-medium italic truncate">
                        {record.notes}
                      </p>
                    )
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditStart(record)}
                    className="p-1.5 text-white/20 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="p-1.5 text-white/20 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
