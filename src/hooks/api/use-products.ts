import { QUERY_KEYS } from '@/constants';
import { productsApi } from '@/lib/api';
import type {
  ApiError,
  PaginatedResponse,
  Product,
  ProductFilterParams,
  ProductWithDetails,
} from '@/types';
import {
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * Hook to fetch all products
 */
export function useProducts(
  params?: ProductFilterParams,
  options?: Omit<UseQueryOptions<Product[], AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productsApi.getAll(params),
    ...options,
  });
}

/**
 * Hook to fetch paginated products
 */
export function useProductsPaginated(
  params?: ProductFilterParams & { page?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Product>, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, 'paginated', params],
    queryFn: () => productsApi.getPaginated(params),
    ...options,
  });
}

/**
 * Hook to fetch a single product by Slug
 */
export function useProduct(
  slug: string,
  options?: Omit<
    UseQueryOptions<ProductWithDetails, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(slug),
    queryFn: () => productsApi.getByIdOrSlug(slug),
    enabled: Boolean(slug),
    ...options,
  });
}

/**
 * Hook to fetch a single product by slug
 */
export function useProductBySlug(
  slug: string,
  options?: Omit<
    UseQueryOptions<ProductWithDetails, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(slug),
    queryFn: () => productsApi.getByIdOrSlug(slug),
    enabled: Boolean(slug),
    ...options,
  });
}
