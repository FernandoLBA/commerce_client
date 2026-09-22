import { API_ENDPOINTS } from '@/constants';
import type {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductFilterParams,
  ProductWithDetails,
} from '@/types';
import { apiClient } from './client';

/**
 * Products API service
 */
export const productsApi = {
  /**
   * Get all products with optional filters
   */
  getAll: async (params?: ProductFilterParams): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params }
    );
    return response.data.data;
  },

  /**
   * Get paginated products with filters
   */
  getPaginated: async (
    params?: ProductFilterParams & { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single product by ID or slug
   */
  getByIdOrSlug: async (search: string): Promise<ProductWithDetails> => {
    const response = await apiClient.get<ApiResponse<ProductWithDetails>>(
      API_ENDPOINTS.PRODUCTS.BY_SEARCH(search)
    );
    return response.data.data;
  },
};
