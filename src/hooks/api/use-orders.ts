import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants';
import { ordersApi } from '@/lib/api';
import type { Order, CreateOrderData, OrderFilterParams, ApiError } from '@/types';

/**
 * Hook to fetch all orders
 */
export function useOrders(
  params?: OrderFilterParams,
  options?: Omit<UseQueryOptions<Order[], AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, params],
    queryFn: () => ordersApi.getAll(params),
    ...options,
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(
  id: string,
  options?: Omit<UseQueryOptions<Order, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER(id),
    queryFn: () => ordersApi.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}

/**
 * Hook to create an order
 */
export function useCreateOrder(
  options?: UseMutationOptions<Order, AxiosError<ApiError>, CreateOrderData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    ...options,
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder(
  options?: UseMutationOptions<Order, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDER(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    ...options,
  });
}
