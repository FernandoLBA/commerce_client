import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  ApiResponse,
} from '@/types';

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
};
