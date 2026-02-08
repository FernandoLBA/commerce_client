import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type {
  Product,
  ProductWithDetails,
  ProductFilterParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

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
   * Get single product by ID
   */
  getById: async (id: string): Promise<ProductWithDetails> => {
    const response = await apiClient.get<ApiResponse<ProductWithDetails>>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get single product by slug
   */
  getBySlug: async (slug: string): Promise<ProductWithDetails> => {
    const response = await apiClient.get<ApiResponse<ProductWithDetails>>(
      API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)
    );
    return response.data.data;
  },
};
