import { create } from 'zustand';

import { authApi } from '../services/api.js';

export const useAuthStore = create((set) => ({
  status: 'idle', // idle | loading | authenticated | unauthenticated
  user: null,
  gmail: null,

  loadSession: async () => {
    set({ status: 'loading' });

    try {
      const data = await authApi.status();
      set({ status: 'authenticated', user: data.user, gmail: data.gmail });
    } catch {
      set({ status: 'unauthenticated', user: null, gmail: null });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ status: 'unauthenticated', user: null, gmail: null });
    }
  },

  disconnectGmail: async () => {
    const data = await authApi.disconnect();
    set({ gmail: data.gmail });
  },
}));
