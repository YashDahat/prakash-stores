// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface ReviewDto {
  id: number;
  productId: number;
  userId: number;
  customerName: string;
  rating: number;
  comment: string;
  reviewDate: string;
  status: string;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

