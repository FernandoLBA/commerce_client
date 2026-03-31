import { API_ENDPOINTS } from '@/constants';
import type {
  AdminOrderFilters,
  AdminProductFilters,
  AdminReviewFilters,
  AdminStats,
  AdminUpdateUserData,
  AdminUserFilters,
  ApiResponse,
  Category,
  CreateCategoryData,
  CreateProductData,
  Order,
  PaginatedResponse,
  Product,
  ProductWithDetails,
  Review,
  UpdateCategoryData,
  UpdateOrderData,
  UpdateProductData,
  User,
} from '@/types';
import { apiClient } from './client';

/**
 * Admin API service
 * All operations require ADMIN role (enforced by backend)
 */
export const adminApi = {
  // ── Stats ────────────────────────────────────────────────────────────────

  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<ApiResponse<AdminStats>>(
      API_ENDPOINTS.ADMIN.STATS
    );
    return response.data.data;
  },

  // ── Products ─────────────────────────────────────────────────────────────

  /**
   * Get paginated product list (admin view)
   * Normalizes both flat-array and paginated response shapes from the backend.
   */
  getProducts: async (
    params?: AdminProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product> | Product[]>>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params }
    );
    const payload = response.data.data;
    // Backend may return a flat array or a paginated object
    if (Array.isArray(payload)) {
      return {
        data: payload,
        meta: {
          total: payload.length,
          page: params?.page ?? 1,
          limit: params?.limit ?? payload.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
    return payload;
  },

  /**
   * Create a new product
   */
  createProduct: async (data: CreateProductData): Promise<ProductWithDetails> => {
    const response = await apiClient.post<ApiResponse<ProductWithDetails>>(
      API_ENDPOINTS.PRODUCTS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update an existing product by slug
   */
  updateProduct: async (
    slug: string,
    data: UpdateProductData
  ): Promise<ProductWithDetails> => {
    const response = await apiClient.patch<ApiResponse<ProductWithDetails>>(
      API_ENDPOINTS.PRODUCTS.BY_SEARCH(slug),
      data
    );
    return response.data.data;
  },

  /**
   * Delete a product by slug
   */
  deleteProduct: async (slug: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_SEARCH(slug));
  },

  // ── Categories ───────────────────────────────────────────────────────────

  /**
   * Create a new category
   */
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update an existing category
   */
  updateCategory: async (
    slug: string,
    data: UpdateCategoryData
  ): Promise<Category> => {
    const response = await apiClient.patch<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.BY_SEARCH(slug),
      data
    );
    return response.data.data;
  },

  /**
   * Upload category's image file
   */
  uploadCategoryImage: async(slug: string, file: File): Promise<Category> => {
    const formData = new FormData();
    formData.append('file', file)
    const response = await apiClient.patch<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.UPLOAD_IMAGE(slug),
      formData,
      { headers: { 'Content-Type': file.type } }
    );

    return response.data.data;
  },

  /**
   * Delete a category
   */
  deleteCategory: async (slug: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_SEARCH(slug));
  },

  // ── Orders ───────────────────────────────────────────────────────────────

  /**
   * Get paginated order list (admin view - all orders)
   */
  getOrders: async (
    params?: AdminOrderFilters
  ): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      API_ENDPOINTS.ORDERS.ADMIN,
      { params }
    );
    return response.data.data;
  },

  /**
   * Get a single order by ID
   */
  getOrder: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Update order (status, tracking, admin notes)
   */
  updateOrder: async (id: string, data: UpdateOrderData): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  // ── Users ────────────────────────────────────────────────────────────────

  /**
   * Get paginated user list (admin view)
   */
  getUsers: async (
    params?: AdminUserFilters
  ): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      API_ENDPOINTS.ADMIN.USERS,
      { params }
    );
    return response.data.data;
  },

  /**
   * Update a user (role, active status, profile)
   */
  updateUser: async (id: string, data: AdminUpdateUserData): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.ADMIN.USER_BY_ID(id),
      data
    );
    return response.data.data;
  },

  // ── Reviews ──────────────────────────────────────────────────────────────

  /**
   * Get paginated review list (admin view)
   */
  getReviews: async (
    params?: AdminReviewFilters
  ): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Review>>>(
      API_ENDPOINTS.ADMIN.REVIEWS,
      { params }
    );
    return response.data.data;
  },

  /**
   * Approve a review
   */
  approveReview: async (id: string): Promise<Review> => {
    const response = await apiClient.patch<ApiResponse<Review>>(
      API_ENDPOINTS.ADMIN.REVIEW_APPROVE(id)
    );
    return response.data.data;
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id));
  },
};
