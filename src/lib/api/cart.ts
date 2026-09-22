import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type {
  Cart,
  CartWithTotals,
  AddToCartData,
  UpdateCartItemData,
  CartValidationResult,
  ApiResponse,
} from '@/types';

/**
 * Cart API service
 */
export const cartApi = {
  /**
   * Get current user's cart
   */
  get: async (): Promise<CartWithTotals> => {
    const response = await apiClient.get<ApiResponse<CartWithTotals>>(
      API_ENDPOINTS.CART.BASE
    );
    return response.data.data;
  },

  /**
   * Add item to cart
   */
  addItem: async (data: AddToCartData): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>(
      API_ENDPOINTS.CART.ITEMS,
      data
    );
    return response.data.data;
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (
    itemId: string,
    data: UpdateCartItemData
  ): Promise<Cart> => {
    const response = await apiClient.patch<ApiResponse<Cart>>(
      API_ENDPOINTS.CART.ITEM_BY_ID(itemId),
      data
    );
    return response.data.data;
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART.ITEM_BY_ID(itemId));
  },

  /**
   * Clear entire cart
   */
  clear: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART.BASE);
  },

  /**
   * Validate cart before checkout
   */
  validate: async (): Promise<CartValidationResult> => {
    const response = await apiClient.get<ApiResponse<CartValidationResult>>(
      API_ENDPOINTS.CART.VALIDATE
    );
    return response.data.data;
  },
};
