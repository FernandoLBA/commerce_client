import { QUERY_KEYS } from '@/constants';
import { adminApi } from '@/lib/api';
import type {
  AdminOrderFilters,
  AdminProductFilters,
  AdminReviewFilters,
  AdminStats,
  AdminUpdateUserData,
  AdminUserFilters,
  ApiError,
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
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

// ── Stats ────────────────────────────────────────────────────────────────────

export function useAdminStats(
  options?: Omit<UseQueryOptions<AdminStats, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_STATS,
    queryFn: () => adminApi.getStats(),
    staleTime: 60 * 1000, // 1 min
    ...options,
  });
}

// ── Products ─────────────────────────────────────────────────────────────────

export function useAdminProducts(
  filters?: AdminProductFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Product>, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_PRODUCTS(filters),
    queryFn: () => adminApi.getProducts(filters),
    ...options,
  });
}

export function useCreateProduct(
  options?: UseMutationOptions<ProductWithDetails, AxiosError<ApiError>, CreateProductData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
    ...options,
  });
}

export function useUpdateProduct(
  options?: UseMutationOptions<
    ProductWithDetails,
    AxiosError<ApiError>,
    { slug: string; data: UpdateProductData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => adminApi.updateProduct(slug, data),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_PRODUCT(slug) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
    ...options,
  });
}

export function useDeleteProduct(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => adminApi.deleteProduct(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
    ...options,
  });
}

// ── Categories ───────────────────────────────────────────────────────────────

export function useCreateCategory(
  options?: UseMutationOptions<Category, AxiosError<ApiError>, CreateCategoryData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
    ...options,
  });
}

export function useUpdateCategory(
  options?: UseMutationOptions<
    Category,
    AxiosError<ApiError>,
    { id: string; data: UpdateCategoryData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminApi.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY(id) });
    },
    ...options,
  });
}

export function useDeleteCategory(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
    ...options,
  });
}

// ── Orders ───────────────────────────────────────────────────────────────────

export function useAdminOrders(
  filters?: AdminOrderFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Order>, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_ORDERS(filters),
    queryFn: () => adminApi.getOrders(filters),
    ...options,
  });
}

export function useAdminOrder(
  id: string,
  options?: Omit<UseQueryOptions<Order, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_ORDER(id),
    queryFn: () => adminApi.getOrder(id),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateOrder(
  options?: UseMutationOptions<
    Order,
    AxiosError<ApiError>,
    { id: string; data: UpdateOrderData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminApi.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ORDER(id) });
    },
    ...options,
  });
}

// ── Users ────────────────────────────────────────────────────────────────────

export function useAdminUsers(
  filters?: AdminUserFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<User>, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_USERS(filters),
    queryFn: () => adminApi.getUsers(filters),
    ...options,
  });
}

export function useAdminUpdateUser(
  options?: UseMutationOptions<
    User,
    AxiosError<ApiError>,
    { id: string; data: AdminUpdateUserData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    ...options,
  });
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export function useAdminReviews(
  filters?: AdminReviewFilters,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Review>, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN_REVIEWS(filters),
    queryFn: () => adminApi.getReviews(filters),
    ...options,
  });
}

export function useApproveReview(
  options?: UseMutationOptions<Review, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.approveReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
    ...options,
  });
}

export function useAdminDeleteReview(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
    ...options,
  });
}
