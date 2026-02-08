import { API_ENDPOINTS } from '@/constants';
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from '@/types';
import { apiClient } from './client';

/**
 * Authentication API service
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data.data;
  },

  /**
   * Login with credentials
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  },

  /**
   * Validate current token
   */
  validate: async (token: string): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.VALIDATE,
      { token }
    );
    return response.data.data;
  },

  /**
   * Activate user account
   */
  activateAccount: async (token: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.ACTIVATE, { token });
  },

  /**
   * Resend activation email
   */
  resendActivationEmail: async (email: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESEND_ACTIVATION_TOKEN, { email });
  },
};
