import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

/**
 * Auth store for managing authentication state
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Hook to check if auth store has hydrated
 * Uses Zustand's persist API directly
 */
export const useAuthHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if already hydrated
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // Check immediately in case hydration already finished
    setHydrated(useAuthStore.persist.hasHydrated());

    return () => {
      unsub();
    };
  }, []);

  return hydrated;
};

/**
 * Selector for checking if user is admin
 */
export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === 'ADMIN');

/**
 * Selector for getting user ID
 */
export const useUserId = () =>
  useAuthStore((state) => state.user?.id ?? null);
