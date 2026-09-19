// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface ReviewDto {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  reviewDate: string;
  status: ReviewStatus;
}

export const ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ReviewStatus = typeof ReviewStatus[keyof typeof ReviewStatus];

export const ReviewStatusValues = ['PENDING', 'APPROVED', 'REJECTED'] as const;

