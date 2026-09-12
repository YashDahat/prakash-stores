// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { BrandDto } from '@/types/brand';

export const getAllBrands = async (): Promise<BrandDto[]> => {
  const response = await apiClient.get<BrandDto[]>('/api/v1/brands');
  return response.data;
};

export const getBrandById = async (brandId: number): Promise<BrandDto> => {
  const response = await apiClient.get<BrandDto>(`/api/v1/brands/${brandId}`);
  return response.data;
};

export const createBrand = async (request: BrandDto): Promise<BrandDto> => {
  const response = await apiClient.post<BrandDto>('/api/v1/admin/brands', request);
  return response.data;
};

export const updateBrand = async (brandId: number, request: BrandDto): Promise<BrandDto> => {
  const response = await apiClient.put<BrandDto>(`/api/v1/admin/brands/${brandId}`, request);
  return response.data;
};

export const deleteBrand = async (brandId: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/brands/${brandId}`);
};

