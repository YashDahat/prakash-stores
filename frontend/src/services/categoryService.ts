// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/categories/${categoryId}`);
};

