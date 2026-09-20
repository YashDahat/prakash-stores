// TanStack mutations for the admin bulk-import endpoints. Each invalidates the matching query key
// so the relevant admin table refreshes after a successful import.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bulkUploadProducts,
  bulkUploadCategories,
  bulkUploadBrands,
  bulkUploadEvents,
} from '@/services/bulkUploadService';
import type { BulkUploadResult } from '@/types/bulkUpload';

export function useBulkUploadProducts() {
  const queryClient = useQueryClient();
  return useMutation<BulkUploadResult, Error, File>({
    mutationFn: (file: File) => bulkUploadProducts(file),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product'] }); },
  });
}

export function useBulkUploadCategories() {
  const queryClient = useQueryClient();
  return useMutation<BulkUploadResult, Error, File>({
    mutationFn: (file: File) => bulkUploadCategories(file),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product'] }); },
  });
}

export function useBulkUploadBrands() {
  const queryClient = useQueryClient();
  return useMutation<BulkUploadResult, Error, File>({
    mutationFn: (file: File) => bulkUploadBrands(file),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product'] }); },
  });
}

export function useBulkUploadEvents() {
  const queryClient = useQueryClient();
  return useMutation<BulkUploadResult, Error, File>({
    mutationFn: (file: File) => bulkUploadEvents(file),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['event'] }); },
  });
}
