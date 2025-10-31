import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

export function useProducts(params?: any) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/api/store/products', params],
    async () => {
      const response = await apiClient.getProducts(params);
      return response.data;
    }
  );

  return {
    products: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

export function useProduct(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/store/products/${id}` : null,
    async () => {
      const response = await apiClient.getProduct(id!);
      return response.data;
    }
  );

  return {
    product: data?.data,
    isLoading,
    error,
    mutate,
  };
}
