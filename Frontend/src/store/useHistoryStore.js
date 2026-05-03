import { create } from 'zustand';
import {
  getHistory,
  saveSearch,
  updateRecord,
  deleteRecord,
} from '../api';

export const useHistoryStore = create((set, get) => ({
  // State
  records: JSON.parse(localStorage.getItem('weather_history') || '[]'),
  selectedIds: [],
  loading: false,
  error: null,

  // Actions
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getHistory();
      // If backend returns data, merge it. If it's empty (mock mode), keep what we have in localStorage
      if (response.data && response.data.length > 0) {
        set({ records: response.data, loading: false });
        localStorage.setItem('weather_history', JSON.stringify(response.data));
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.warn('Backend history fetch failed, using local storage');
      set({ loading: false });
    }
  },

  addRecord: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await saveSearch(payload);
      set((state) => {
        const newRecords = [response.data, ...state.records];
        localStorage.setItem('weather_history', JSON.stringify(newRecords));
        return { records: newRecords, loading: false };
      });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateRecord: async (id, payload) => {
    try {
      const response = await updateRecord(id, payload);
      set((state) => {
        const newRecords = state.records.map((r) =>
          r._id === id ? { ...r, ...response.data } : r
        );
        localStorage.setItem('weather_history', JSON.stringify(newRecords));
        return { records: newRecords };
      });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  removeRecord: async (id) => {
    try {
      await deleteRecord(id);
    } catch (err) {
      console.warn('Backend delete failed, performing local removal');
    }
    set((state) => {
      const newRecords = state.records.filter((r) => r._id !== id);
      localStorage.setItem('weather_history', JSON.stringify(newRecords));
      return { records: newRecords };
    });
  },

  removeSelected: async () => {
    const { selectedIds, records } = get();
    if (selectedIds.length === 0) return;

    try {
      // Attempt to delete each on backend (best effort)
      await Promise.all(selectedIds.map(id => deleteRecord(id).catch(() => {})));
    } catch (err) {
      console.warn('Backend bulk delete had issues, performing local removal');
    }

    set((state) => {
      const newRecords = state.records.filter((r) => !selectedIds.includes(r._id));
      localStorage.setItem('weather_history', JSON.stringify(newRecords));
      return { records: newRecords, selectedIds: [] };
    });
  },

  toggleSelection: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    }));
  },

  clearSelection: () => set({ selectedIds: [] }),

  selectAll: () => set((state) => ({ selectedIds: state.records.map(r => r._id) })),

  clearHistory: () => {
    set({ records: [], selectedIds: [] });
    localStorage.removeItem('weather_history');
  },

  clearError: () => set({ error: null }),
}));
