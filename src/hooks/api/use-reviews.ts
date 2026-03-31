import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants';
import { reviewsApi } from '@/lib/api';
import type {
  Review,
  CreateReviewData,
  UpdateReviewData,
  ReviewFilterParams,
  ProductRating,
  PaginatedResponse,
  ApiError,
} from '@/types';

/**
 * Hook to fetch reviews with filters
 */
export function useReviews(
  params?: ReviewFilterParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Review>, AxiosError<ApiError>>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.REVIEWS(params?.productId), params],
    queryFn: () => reviewsApi.getAll(params),
    ...options,
  });
}

/**
 * Hook to fetch product rating
 */
export function useProductRating(
  productId: string,
  options?: Omit<UseQueryOptions<ProductRating, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_RATING(productId),
    queryFn: () => reviewsApi.getProductRating(productId),
    enabled: Boolean(productId),
    ...options,
  });
}

/**
 * Hook to fetch current user's reviews
 */
export function useMyReviews(
  options?: Omit<UseQueryOptions<Review[], AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.MY_REVIEWS,
    queryFn: () => reviewsApi.getMyReviews(),
    ...options,
  });
}

/**
 * Hook to create a review
 */
export function useCreateReview(
  options?: UseMutationOptions<Review, AxiosError<ApiError>, CreateReviewData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_RATING(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_REVIEWS });
    },
    ...options,
  });
}

/**
 * Hook to update a review
 */
export function useUpdateReview(
  options?: UseMutationOptions<
    Review,
    AxiosError<ApiError>,
    { id: string; data: UpdateReviewData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => reviewsApi.update(id, data),
    onSuccess: (review) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS(review.productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_RATING(review.productId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_REVIEWS });
    },
    ...options,
  });
}

/**
 * Hook to delete a review
 */
export function useDeleteReview(
  options?: UseMutationOptions<void, AxiosError<ApiError>, { id: string; productId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => reviewsApi.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_RATING(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_REVIEWS });
    },
    ...options,
  });
}

/**
 * Hook to mark review as helpful
 */
export function useMarkReviewHelpful(
  options?: UseMutationOptions<Review, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewsApi.markHelpful(id),
    onSuccess: (review) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS(review.productId),
      });
    },
    ...options,
  });
}
