// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { ProductCategory, ProductDto } from '@/types/product';
import type { Brand } from '@/types/brand';

export const getAllProducts = async (): Promise<ProductDto[]> => {
  // The endpoint is paginated (Spring default size 20); the storefront filters/paginates client-side,
  // so request a large page to return the whole catalogue in one call.
  const response = await apiClient.get<{ content: ProductDto[] }>('/api/v1/products?size=10000');
  return response.data.content;
};

export const getProductById = async (id: number): Promise<ProductDto> => {
  const response = await apiClient.get<ProductDto>(`/api/v1/products/${id}`);
  return response.data;
};

export const getAllCategories = async (): Promise<ProductCategory[]> => {
  const response = await apiClient.get<ProductCategory[]>('/api/v1/products/categories');
  return response.data;
};

export const getAllBrands = async (): Promise<Brand[]> => {
  const response = await apiClient.get<Brand[]>('/api/v1/products/brands');
  return response.data;
};

export const createProduct = async (request: ProductDto): Promise<ProductDto> => {
  const response = await apiClient.post<ProductDto>('/api/v1/admin/products', request);
  return response.data;
};

export const updateProduct = async (id: number, request: ProductDto): Promise<ProductDto> => {
  const response = await apiClient.put<ProductDto>(`/api/v1/admin/products/${id}`, request);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/products/${id}`);
};

export const updateProductStock = async (id: number, request: unknown): Promise<ProductDto> => {
  const response = await apiClient.put<ProductDto>(`/api/v1/admin/products/${id}/stock`, request);
  return response.data;
};

export const adminGetAllProducts = async (): Promise<ProductDto[]> => {
  // The endpoint is paginated (Spring default size 20). The admin grid does its own client-side
  // pagination, so request a large page to return the full catalogue in one call.
  const response = await apiClient.get<{ content: ProductDto[] }>('/api/v1/admin/products?size=10000&sort=id,desc');
  return response.data.content;
};

export const adminGetProductById = async (id: number): Promise<ProductDto> => {
  const response = await apiClient.get<ProductDto>(`/api/v1/admin/products/${id}`);
  return response.data;
};

export const adminGetAllCategories = async (): Promise<ProductCategory[]> => {
  const response = await apiClient.get<ProductCategory[]>('/api/v1/admin/products/categories');
  return response.data;
};

export const createCategory = async (request: ProductCategory): Promise<ProductCategory> => {
  const response = await apiClient.post<ProductCategory>('/api/v1/admin/products/categories', request);
  return response.data;
};

export const updateCategory = async (id: number, request: ProductCategory): Promise<ProductCategory> => {
  const response = await apiClient.put<ProductCategory>(`/api/v1/admin/products/categories/${id}`, request);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/products/categories/${id}`);
};

export const adminGetAllBrands = async (): Promise<Brand[]> => {
  const response = await apiClient.get<Brand[]>('/api/v1/admin/products/brands');
  return response.data;
};

export const createBrand = async (request: Brand): Promise<Brand> => {
  const response = await apiClient.post<Brand>('/api/v1/admin/products/brands', request);
  return response.data;
};

export const updateBrand = async (id: number, request: Brand): Promise<Brand> => {
  const response = await apiClient.put<Brand>(`/api/v1/admin/products/brands/${id}`, request);
  return response.data;
};

export const deleteBrand = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/products/brands/${id}`);
};

