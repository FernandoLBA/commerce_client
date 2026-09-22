import { API_ENDPOINTS } from '@/constants';
import { apiClient } from './client';
import type { Order, CreateOrderData, OrderFilterParams, ApiResponse } from '@/types';

/**
 * Orders API service
 */
export const ordersApi = {
  /**
   * Get all orders for current user
   */
  getAll: async (params?: OrderFilterParams): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>(
      API_ENDPOINTS.ORDERS.BASE,
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single order by ID
   */
  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get order by order number
   */
  getByOrderNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.BY_NUMBER(orderNumber)
    );
    return response.data.data;
  },

  /**
   * Create a new order
   */
  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Cancel an order
   */
  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.CANCEL(id)
    );
    return response.data.data;
  },
};
