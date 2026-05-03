import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Weather ──────────────────────────────────────────────────────────────────
export const searchWeather = (q) =>
  api.get('/weather/search', { params: { q } }).then((r) => r.data);

// ─── History (CRUD) ────────────────────────────────────────────────────────────
export const getHistory = () =>
  api.get('/history').then((r) => r.data);

export const getSuggestions = (query) =>
  api.get(`/weather/suggestions?q=${query}`).then((r) => r.data);

export const saveSearch = (payload) =>
  api.post('/history', payload).then((r) => r.data);

export const updateRecord = (id, payload) =>
  api.put(`/history/${id}`, payload).then((r) => r.data);

export const deleteRecord = (id) =>
  api.delete(`/history/${id}`).then((r) => r.data);

// ─── Export ────────────────────────────────────────────────────────────────────
export const exportJSON = () =>
  api.get('/export/json', { responseType: 'blob' }).then((r) => r.data);

export const exportCSV = () =>
  api.get('/export/csv', { responseType: 'blob' }).then((r) => r.data);

export default api;
