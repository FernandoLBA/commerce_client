import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants';
import { cartApi } from '@/lib/api';
import type {
  Cart,
  CartWithTotals,
  AddToCartData,
  UpdateCartItemData,
  CartValidationResult,
  ApiError,
} from '@/types';

/**
 * Hook to fetch current cart
 */
export function useCart(
  options?: Omit<UseQueryOptions<CartWithTotals, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.CART,
    queryFn: () => cartApi.get(),
    ...options,
  });
}

/**
 * Hook to validate cart
 */
export function useCartValidation(
  options?: Omit<
    UseQueryOptions<CartValidationResult, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.CART_VALIDATION,
    queryFn: () => cartApi.validate(),
    ...options,
  });
}

/**
 * Hook to add item to cart
 */
export function useAddToCart(
  options?: UseMutationOptions<Cart, AxiosError<ApiError>, AddToCartData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartData) => cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    ...options,
  });
}

/**
 * Hook to update cart item
 */
export function useUpdateCartItem(
  options?: UseMutationOptions<
    Cart,
    AxiosError<ApiError>,
    { itemId: string; data: UpdateCartItemData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }) => cartApi.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    ...options,
  });
}

/**
 * Hook to remove item from cart
 */
export function useRemoveCartItem(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    ...options,
  });
}

/**
 * Hook to clear cart
 */
export function useClearCart(
  options?: UseMutationOptions<void, AxiosError<ApiError>, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    ...options,
  });
}
