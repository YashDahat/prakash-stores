// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { ProductCategoryDto, ProductDto } from '@/types/product';

export const getAllProducts = async (): Promise<ProductDto[]> => {
  const response = await apiClient.get<ProductDto[]>('/api/v1/products');
  return response.data;
};

export const getProductById = async (productId: number): Promise<ProductDto> => {
  const response = await apiClient.get<ProductDto>(`/api/v1/products/${productId}`);
  return response.data;
};

export const searchProducts = async (): Promise<ProductDto[]> => {
  const response = await apiClient.get<ProductDto[]>('/api/v1/products/search');
  return response.data;
};

export const getAllCategories = async (): Promise<ProductCategoryDto[]> => {
  const response = await apiClient.get<ProductCategoryDto[]>('/api/v1/categories');
  return response.data;
};

export const getCategoryById = async (categoryId: number): Promise<ProductCategoryDto> => {
  const response = await apiClient.get<ProductCategoryDto>(`/api/v1/categories/${categoryId}`);
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

export const createCategory = async (request: ProductCategoryDto): Promise<ProductCategoryDto> => {
  const response = await apiClient.post<ProductCategoryDto>('/api/v1/admin/categories', request);
  return response.data;
};

export const updateCategory = async (categoryId: number, request: ProductCategoryDto): Promise<ProductCategoryDto> => {
  const response = await apiClient.put<ProductCategoryDto>(`/api/v1/admin/categories/${categoryId}`, request);
  return response.data;
};

