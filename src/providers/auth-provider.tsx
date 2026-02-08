'use client';

import { useEffect } from 'react';
import { setAuthCookie, removeAuthCookie } from '@/lib/cookies';
import { useAuthStore } from '@/store';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth provider that syncs the auth cookie for middleware protection
 * The actual hydration is handled by Zustand persist
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Sync cookie with auth state for middleware protection
    if (isAuthenticated && token) {
      setAuthCookie(token);
    } else {
      removeAuthCookie();
    }
  }, [isAuthenticated, token]);

  return <>{children}</>;
}
