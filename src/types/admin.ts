import type { OrderStatus } from '@/constants';
import type { PaginationParams, SortParams } from './common';

/**
 * Admin dashboard statistics
 */
export interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

/**
 * Create product data (admin)
 */
export interface CreateProductData {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isActive?: boolean;
  categoryId?: string;
}

/**
 * Update product data (admin)
 */
export type UpdateProductData = Partial<CreateProductData>;

/**
 * Create category data (admin)
 */
export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
  displayOrder?: number;
}

/**
 * Update category data (admin)
 */
export type UpdateCategoryData = Partial<CreateCategoryData>;

/**
 * Update order details/status (admin)
 */
export interface UpdateOrderData {
  status?: OrderStatus;
  adminNotes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

/**
 * Update user data (admin)
 */
export interface AdminUpdateUserData {
  isActive?: boolean;
  role?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Base admin list filters
 */
export interface AdminBaseFilters extends PaginationParams, SortParams {
  search?: string;
}

/**
 * Admin filters for products
 */
export interface AdminProductFilters extends AdminBaseFilters {
  isActive?: boolean;
  categoryId?: string;
}

/**
 * Admin filters for orders
 */
export interface AdminOrderFilters extends AdminBaseFilters {
  status?: OrderStatus;
  userId?: string;
}

/**
 * Admin filters for users
 */
export interface AdminUserFilters extends AdminBaseFilters {
  isActive?: boolean;
  role?: string;
}

/**
 * Admin filters for reviews
 */
export interface AdminReviewFilters extends AdminBaseFilters {
  productId?: string;
  rating?: number;
  isApproved?: boolean;
}
