/**
 * Common type utilities and base types
 */

/**
 * Standard API response wrapper from backend
 */
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

/**
 * Makes specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Extracts the resolved type from a Promise
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * API error response
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: ApiErrorDetail;
}

/**
 * API error response details
 */
export interface ApiErrorDetail {
  code: string;
  message: string;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Generic sort parameters
 */
export interface SortParams<T extends string = string> {
  sortBy?: T;
  sortOrder?: SortDirection;
}

/**
 * Success response wrapper
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}
