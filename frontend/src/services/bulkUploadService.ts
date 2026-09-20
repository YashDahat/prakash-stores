// Admin bulk import (Excel/CSV) — one multipart POST per entity. Mirrors the media upload pattern.
import apiClient from '@/api/client';
import type { BulkUploadResult } from '@/types/bulkUpload';

const upload = async (url: string, file: File): Promise<BulkUploadResult> => {
  const form = new FormData();
  form.append('file', file);
  const response = await apiClient.post<BulkUploadResult>(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const bulkUploadProducts = (file: File): Promise<BulkUploadResult> =>
  upload('/api/v1/admin/products/bulk-upload', file);

export const bulkUploadCategories = (file: File): Promise<BulkUploadResult> =>
  upload('/api/v1/admin/products/categories/bulk-upload', file);

export const bulkUploadBrands = (file: File): Promise<BulkUploadResult> =>
  upload('/api/v1/admin/products/brands/bulk-upload', file);

export const bulkUploadEvents = (file: File): Promise<BulkUploadResult> =>
  upload('/api/v1/admin/events/bulk-upload', file);
