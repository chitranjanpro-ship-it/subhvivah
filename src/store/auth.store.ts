import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  vertical?: string;
  profiles?: any[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      set({ user: null });
    }
  },

  checkAuth: async () => {
    if (typeof window === 'undefined') return;
    
    // Don't set loading if we already have a user (prevents flicker on back button)
    const { user } = useAuthStore.getState();
    if (!user) set({ isLoading: true });

    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      // Don't auto-logout on checkAuth failure unless we're sure it's an expired session
      // This prevents logout when offline or during transient network issues
      set({ user: null, isLoading: false });
    }
  },
}));
