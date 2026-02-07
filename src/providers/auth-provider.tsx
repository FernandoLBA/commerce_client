'use client';

import { useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { useAuthStore } from '@/store';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth provider that hydrates auth state from localStorage
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setAuth(user, token);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setAuth, setLoading, clearAuth]);

  return <>{children}</>;
}
