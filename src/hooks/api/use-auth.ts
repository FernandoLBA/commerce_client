import {
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { STORAGE_KEYS } from '@/constants';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ApiError,
} from '@/types';

/**
 * Hook for user login
 */
export function useLogin(
  options?: UseMutationOptions<AuthResponse, AxiosError<ApiError>, LoginCredentials>
) {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      setAuth(data.user, data.access_token);
    },
    ...options,
  });
}

/**
 * Hook for user registration
 */
export function useRegister(
  options?: UseMutationOptions<AuthResponse, AxiosError<ApiError>, RegisterData>
) {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.access_token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      setAuth(data.user, data.access_token);
    },
    ...options,
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const { clearAuth } = useAuthStore();

  return () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    clearAuth();
  };
}
