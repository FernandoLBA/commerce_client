import {
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants';
import { productsApi } from '@/lib/api';
import type {
  Product,
  ProductWithDetails,
  ProductFilterParams,
  PaginatedResponse,
  ApiError,
} from '@/types';

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
 * Hook to fetch a single product by ID
 */
export function useProduct(
  id: string,
  options?: Omit<
    UseQueryOptions<ProductWithDetails, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn: () => productsApi.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}

/**
 * Hook to fetch a single product by id
 */
export function useProductById(
  id: string,
  options?: Omit<
    UseQueryOptions<ProductWithDetails, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn: () => productsApi.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}
