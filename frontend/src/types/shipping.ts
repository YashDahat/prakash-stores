// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export const ShippingMethod = {
  HOME_DELIVERY: 'HOME_DELIVERY',
  CLICK_AND_COLLECT: 'CLICK_AND_COLLECT',
} as const;

export type ShippingMethod = typeof ShippingMethod[keyof typeof ShippingMethod];

export const ShippingMethodValues = ['HOME_DELIVERY', 'CLICK_AND_COLLECT'] as const;

