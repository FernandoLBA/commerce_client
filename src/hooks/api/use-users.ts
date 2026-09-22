import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERY_KEYS } from '@/constants';
import { usersApi } from '@/lib/api';
import type {
  UserProfile,
  UpdateProfileData,
  Address,
  CreateAddressData,
  UpdateAddressData,
  ApiError,
} from '@/types';

/**
 * Hook to fetch user profile
 */
export function useProfile(
  options?: Omit<UseQueryOptions<UserProfile, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => usersApi.getProfile(),
    ...options,
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile(
  options?: UseMutationOptions<UserProfile, AxiosError<ApiError>, UpdateProfileData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
    },
    ...options,
  });
}

/**
 * Hook to fetch all addresses
 */
export function useAddresses(
  options?: Omit<UseQueryOptions<Address[], AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADDRESSES,
    queryFn: () => usersApi.getAddresses(),
    ...options,
  });
}

/**
 * Hook to fetch a single address
 */
export function useAddress(
  id: string,
  options?: Omit<UseQueryOptions<Address, AxiosError<ApiError>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.ADDRESS(id),
    queryFn: () => usersApi.getAddress(id),
    enabled: Boolean(id),
    ...options,
  });
}

/**
 * Hook to create an address
 */
export function useCreateAddress(
  options?: UseMutationOptions<Address, AxiosError<ApiError>, CreateAddressData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressData) => usersApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    ...options,
  });
}

/**
 * Hook to update an address
 */
export function useUpdateAddress(
  options?: UseMutationOptions<
    Address,
    AxiosError<ApiError>,
    { id: string; data: UpdateAddressData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usersApi.updateAddress(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESS(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    ...options,
  });
}

/**
 * Hook to delete an address
 */
export function useDeleteAddress(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    ...options,
  });
}

/**
 * Hook to set default address
 */
export function useSetDefaultAddress(
  options?: UseMutationOptions<Address, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    ...options,
  });
}
