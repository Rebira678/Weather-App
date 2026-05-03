import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
      const { token, data } = res.data;
      localStorage.setItem('token', token);
      
      // Setup axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const user = data.user;
      const customName = localStorage.getItem('customName');
      const customAvatarSeed = localStorage.getItem('customAvatarSeed');
      if (customName) user.name = customName;
      if (customAvatarSeed) user.avatarSeed = customAvatarSeed;

      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Signup failed', 
        loading: false 
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, data } = res.data;
      localStorage.setItem('token', token);
      
      // Setup axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const user = data.user;
      const customName = localStorage.getItem('customName');
      const customAvatarSeed = localStorage.getItem('customAvatarSeed');
      if (customName) user.name = customName;
      if (customAvatarSeed) user.avatarSeed = customAvatarSeed;

      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateName: (newName, newSeed) => {
    if (newName) localStorage.setItem('customName', newName);
    if (newSeed) localStorage.setItem('customAvatarSeed', newSeed);
    
    set((state) => ({ 
      user: state.user ? { 
        ...state.user, 
        name: newName || state.user.name,
        avatarSeed: newSeed || state.user.avatarSeed
      } : null 
    }));
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customName');
    localStorage.removeItem('customAvatarSeed');
    localStorage.removeItem('weather_history');
    localStorage.removeItem('recent_searches');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, loading: false });
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    set({ loading: true });
    
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      const user = res.data.data.user;
      const customName = localStorage.getItem('customName');
      const customAvatarSeed = localStorage.getItem('customAvatarSeed');
      if (customName) user.name = customName;
      if (customAvatarSeed) user.avatarSeed = customAvatarSeed;
      
      set({ 
        user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  }
}));
