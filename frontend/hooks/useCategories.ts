import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/store/categories',
    async () => {
      const response = await apiClient.getCategories();
      return response.data;
    }
  );

  return {
    categories: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useCategoryBySlug(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/store/categories/${slug}` : null,
    async () => {
      const response = await apiClient.getCategoryBySlug(slug!);
      return response.data;
    }
  );

  return {
    category: data?.data,
    isLoading,
    error,
    mutate,
  };
}

export function useCategoryProducts(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/store/categories/${slug}/products` : null,
    async () => {
      const response = await apiClient.getCategoryProducts(slug!);
      return response.data;
    }
  );

  return {
    products: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}
