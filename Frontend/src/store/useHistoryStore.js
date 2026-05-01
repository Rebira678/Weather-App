import { create } from 'zustand';
import {
  getHistory,
  saveSearch,
  updateRecord,
  deleteRecord,
} from '../api';

export const useHistoryStore = create((set, get) => ({
  // State
  records: [],
  loading: false,
  error: null,

  // Actions
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getHistory();
      set({ records: response.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addRecord: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await saveSearch(payload);
      set((state) => ({
        records: [response.data, ...state.records],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateRecord: async (id, payload) => {
    try {
      const response = await updateRecord(id, payload);
      set((state) => ({
        records: state.records.map((r) =>
          r._id === id ? response.data : r
        ),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  removeRecord: async (id) => {
    try {
      await deleteRecord(id);
      set((state) => ({
        records: state.records.filter((r) => r._id !== id),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
