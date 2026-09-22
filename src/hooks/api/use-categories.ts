import {
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants';
import { categoriesApi } from '@/lib/api';
import type { Category, ApiError } from '@/types';

/**
 * Hook to fetch all categories
 */
export function useCategories(
  options?: Omit<UseQueryOptions<Category[], AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes - categories don't change often
    ...options,
  });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(
  id: string,
  options?: Omit<UseQueryOptions<Category, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORY(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}
