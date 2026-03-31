import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type { Category, ApiResponse } from '@/types';

/**
 * Categories API service
 */
export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.CATEGORIES.BASE
    );
    return response.data.data;
  },

  /**
   * Get single category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.BY_SEARCH(id)
    );
    return response.data.data;
  },
};
