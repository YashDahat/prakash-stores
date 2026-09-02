// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { ProductDto } from '@/types/product';

export const getAllProducts = async (): Promise<void> => {
  await apiClient.get<void>('/api/v1/products');
};

export const getProductById = async (productId: number): Promise<ProductDto> => {
  const response = await apiClient.get<ProductDto>(`/api/v1/products/${productId}`);
  return response.data;
};

export const createProduct = async (request: ProductDto): Promise<ProductDto> => {
  const response = await apiClient.post<ProductDto>('/api/v1/admin/products', request);
  return response.data;
};

export const updateProduct = async (productId: number, request: ProductDto): Promise<ProductDto> => {
  const response = await apiClient.put<ProductDto>(`/api/v1/admin/products/${productId}`, request);
  return response.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/products/${productId}`);
};

export const updateProductStock = async (productId: number, request: unknown): Promise<ProductDto> => {
  const response = await apiClient.put<ProductDto>(`/api/v1/admin/products/${productId}/stock`, request);
  return response.data;
};

