import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

import { QUERY_KEYS } from "@/constants";
import { adminApi } from "@/lib";
import { ProductImage } from "@/types";

export function useUploadProductImages(
  options?: UseMutationOptions<ProductImage,
  AxiosError<ApiError>,
  { productId: string, files: File[] }
  >
){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, files }) => adminApi.uploadProductImages(productId, files),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT(productId) });
    },
    ...options,
  })
}

export function useDeleteProductImage(
    options?: UseMutationOptions<string, 
    AxiosError<ApiError>, 
    { imageId: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId }) => adminApi.deleteProductImage(imageId),
    onSuccess: (_, { imageId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT(imageId) });
    },
    ...options,
  });
}