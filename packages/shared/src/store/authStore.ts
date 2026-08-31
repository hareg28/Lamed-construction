'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const result = await res.json();

          if (result.success && result.user) {
            set({ user: result.user, isAuthenticated: true });
            return { success: true };
          } else {
            return { success: false, error: result.error || 'Invalid email or password' };
          }
        } catch {
          return { success: false, error: 'Connection error. Please try again.' };
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
          // ignore
        }
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'lamed-admin-auth',
    }
  )
);
