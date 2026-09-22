import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type {
  WishlistItem,
  AddToWishlistData,
  UpdateWishlistItemData,
  WishlistCountResponse,
  WishlistCheckResponse,
  ApiResponse,
} from '@/types';

/**
 * Wishlist API service
 */
export const wishlistApi = {
  /**
   * Get all wishlist items for current user
   */
  getAll: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<ApiResponse<WishlistItem[]>>(
      API_ENDPOINTS.WISHLIST.BASE
    );
    return response.data.data;
  },

  /**
   * Get single wishlist item by ID
   */
  getById: async (id: string): Promise<WishlistItem> => {
    const response = await apiClient.get<ApiResponse<WishlistItem>>(
      API_ENDPOINTS.WISHLIST.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Add item to wishlist
   */
  addItem: async (data: AddToWishlistData): Promise<WishlistItem> => {
    const response = await apiClient.post<ApiResponse<WishlistItem>>(
      API_ENDPOINTS.WISHLIST.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update wishlist item
   */
  updateItem: async (
    id: string,
    data: UpdateWishlistItemData
  ): Promise<WishlistItem> => {
    const response = await apiClient.patch<ApiResponse<WishlistItem>>(
      API_ENDPOINTS.WISHLIST.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Remove item from wishlist
   */
  removeItem: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WISHLIST.BY_ID(id));
  },

  /**
   * Clear entire wishlist
   */
  clear: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WISHLIST.BASE);
  },

  /**
   * Get wishlist item count
   */
  getCount: async (): Promise<WishlistCountResponse> => {
    const response = await apiClient.get<ApiResponse<WishlistCountResponse>>(
      API_ENDPOINTS.WISHLIST.COUNT
    );
    return response.data.data;
  },

  /**
   * Check if product is in wishlist
   */
  check: async (
    productId: string,
    variantId?: string
  ): Promise<WishlistCheckResponse> => {
    const response = await apiClient.get<ApiResponse<WishlistCheckResponse>>(
      API_ENDPOINTS.WISHLIST.CHECK,
      { params: { productId, variantId } }
    );
    return response.data.data;
  },

  /**
   * Move wishlist item to cart
   */
  moveToCart: async (id: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.WISHLIST.MOVE_TO_CART(id));
  },
};
