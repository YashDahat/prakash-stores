// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { CreateReviewRequest, ReviewDto } from '@/types/review';

export const createReview = async (request: CreateReviewRequest): Promise<ReviewDto> => {
  const response = await apiClient.post<ReviewDto>('/api/v1/reviews', request);
  return response.data;
};

export const getReviewsByProductId = async (productId: number): Promise<ReviewDto[]> => {
  const response = await apiClient.get<ReviewDto[]>(`/api/v1/reviews/product/${productId}`);
  return response.data;
};

export const getAllReviews = async (): Promise<ReviewDto[]> => {
  const response = await apiClient.get<ReviewDto[]>('/api/v1/admin/reviews');
  return response.data;
};

