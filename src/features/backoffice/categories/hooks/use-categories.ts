// ── Categories ───────────────────────────────────────────────────────────────

import { QUERY_KEYS } from "@/constants";
import { adminApi } from "@/lib";
import { ApiError, Category, CreateCategoryData, UpdateCategoryData } from "@/types";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

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
    { slug: string; data: UpdateCategoryData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => adminApi.updateCategory(slug, data),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY(slug) });
    },
    ...options,
  });
}

export function useDeleteCategory(
  options?: UseMutationOptions<void, AxiosError<ApiError>, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => adminApi.deleteCategory(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
    },
    ...options,
  });
}

export function useUploadCategoryImage(
  options?: UseMutationOptions<
  Category, 
  AxiosError<ApiError>, 
  { slug: string, file: File }
  >
){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, file }) => adminApi.uploadCategoryImage(slug, file),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY(slug) });
    },
    ...options,
  });
}
