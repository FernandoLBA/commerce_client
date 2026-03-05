import { STORAGE_KEYS } from '@/constants';
import { authApi } from '@/lib/api';
import { setAuthCookie, removeAuthCookie } from '@/lib/cookies';
import { useAuthStore } from '@/store/auth';
import type {
  ApiError,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from '@/types';
import {
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
      setAuthCookie(data.access_token);
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
      setAuthCookie(data.access_token);
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
    removeAuthCookie();
    clearAuth();
  };
}

/**
 * Hook for account activation
 */
export function useActivateAccount() {
  return useMutation({
    mutationFn: (token: string) => authApi.activateAccount(token),
  });
}

/**
 * Hook for resending activation email
 */
export function useResendActivationEmail() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendActivationEmail(email),
  });
}

/**
 * Hook for initiating the forgot password process
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

/**
 * Hook for resetting the password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  });
}
