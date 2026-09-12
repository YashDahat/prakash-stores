// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { LoyaltyPointsDto } from '@/types/loyalty';

export const getMyLoyaltyPoints = async (): Promise<LoyaltyPointsDto> => {
  const response = await apiClient.get<LoyaltyPointsDto>('/api/v1/loyalty/my');
  return response.data;
};

