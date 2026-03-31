import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type {
  UserProfile,
  UpdateProfileData,
  Address,
  CreateAddressData,
  UpdateAddressData,
  ApiResponse,
} from '@/types';

/**
 * Users API service
 */
export const usersApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.PROFILE
    );
    return response.data.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      API_ENDPOINTS.USERS.PROFILE,
      data
    );
    return response.data.data;
  },

  /**
   * Get all addresses for current user
   */
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<ApiResponse<Address[]>>(
      API_ENDPOINTS.USERS.ADDRESSES
    );
    return response.data.data;
  },

  /**
   * Get single address by ID
   */
  getAddress: async (id: string): Promise<Address> => {
    const response = await apiClient.get<ApiResponse<Address>>(
      API_ENDPOINTS.USERS.ADDRESS_BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create a new address
   */
  createAddress: async (data: CreateAddressData): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>(
      API_ENDPOINTS.USERS.ADDRESSES,
      data
    );
    return response.data.data;
  },

  /**
   * Update an address
   */
  updateAddress: async (
    id: string,
    data: UpdateAddressData
  ): Promise<Address> => {
    const response = await apiClient.patch<ApiResponse<Address>>(
      API_ENDPOINTS.USERS.ADDRESS_BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.ADDRESS_BY_ID(id));
  },

  /**
   * Set address as default
   */
  setDefaultAddress: async (id: string): Promise<Address> => {
    const response = await apiClient.patch<ApiResponse<Address>>(
      API_ENDPOINTS.USERS.SET_DEFAULT_ADDRESS(id)
    );
    return response.data.data;
  },
};
