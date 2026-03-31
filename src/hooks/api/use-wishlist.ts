import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants';
import { wishlistApi } from '@/lib/api';
import type {
  WishlistItem,
  AddToWishlistData,
  UpdateWishlistItemData,
  WishlistCountResponse,
  WishlistCheckResponse,
  ApiError,
} from '@/types';

/**
 * Hook to fetch all wishlist items
 */
export function useWishlist(
  options?: Omit<UseQueryOptions<WishlistItem[], AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.WISHLIST,
    queryFn: () => wishlistApi.getAll(),
    ...options,
  });
}

/**
 * Hook to fetch wishlist count
 */
export function useWishlistCount(
  options?: Omit<
    UseQueryOptions<WishlistCountResponse, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.WISHLIST_COUNT,
    queryFn: () => wishlistApi.getCount(),
    ...options,
  });
}

/**
 * Hook to check if product is in wishlist
 */
export function useIsInWishlist(
  productId: string,
  variantId?: string,
  options?: Omit<
    UseQueryOptions<WishlistCheckResponse, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: QUERY_KEYS.WISHLIST_CHECK(productId, variantId),
    queryFn: () => wishlistApi.check(productId, variantId),
    enabled: Boolean(productId),
    ...options,
  });
}

/**
 * Hook to add item to wishlist
 */
export function useAddToWishlist(
  options?: UseMutationOptions<WishlistItem, AxiosError<ApiError>, AddToWishlistData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToWishlistData) => wishlistApi.addItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST_COUNT });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WISHLIST_CHECK(variables.productId, variables.variantId),
      });
    },
    ...options,
  });
}

/**
 * Hook to update wishlist item
 */
export function useUpdateWishlistItem(
  options?: UseMutationOptions<
    WishlistItem,
    AxiosError<ApiError>,
    { id: string; data: UpdateWishlistItemData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => wishlistApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
    },
    ...options,
  });
}

/**
 * Hook to remove item from wishlist
 */
export function useRemoveFromWishlist(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wishlistApi.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST_COUNT });
    },
    ...options,
  });
}

/**
 * Hook to clear wishlist
 */
export function useClearWishlist(
  options?: UseMutationOptions<void, AxiosError<ApiError>, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST_COUNT });
    },
    ...options,
  });
}

/**
 * Hook to move wishlist item to cart
 */
export function useMoveToCart(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wishlistApi.moveToCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST_COUNT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
    ...options,
  });
}
