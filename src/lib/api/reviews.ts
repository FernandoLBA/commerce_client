import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type {
  Review,
  CreateReviewData,
  UpdateReviewData,
  ReviewFilterParams,
  ProductRating,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

/**
 * Reviews API service
 */
export const reviewsApi = {
  /**
   * Get reviews with optional filters
   */
  getAll: async (
    params?: ReviewFilterParams
  ): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Review>>>(
      API_ENDPOINTS.REVIEWS.BASE,
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single review by ID
   */
  getById: async (id: string): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(
      API_ENDPOINTS.REVIEWS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get product rating summary
   */
  getProductRating: async (productId: string): Promise<ProductRating> => {
    const response = await apiClient.get<ApiResponse<ProductRating>>(
      API_ENDPOINTS.REVIEWS.PRODUCT_RATING(productId)
    );
    return response.data.data;
  },

  /**
   * Get current user's reviews
   */
  getMyReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(
      API_ENDPOINTS.REVIEWS.MY_REVIEWS
    );
    return response.data.data;
  },

  /**
   * Create a new review
   */
  create: async (data: CreateReviewData): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      API_ENDPOINTS.REVIEWS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update a review
   */
  update: async (id: string, data: UpdateReviewData): Promise<Review> => {
    const response = await apiClient.patch<ApiResponse<Review>>(
      API_ENDPOINTS.REVIEWS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete a review
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id));
  },

  /**
   * Mark review as helpful
   */
  markHelpful: async (id: string): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      API_ENDPOINTS.REVIEWS.HELPFUL(id)
    );
    return response.data.data;
  },
};
