// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface OrderResponse {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  orderType: OrderType;
  shippingAddress: string;
  contactPhone: string;
  items: OrderItemResponse[];
}

export interface CreateOrderRequest {
  orderType: OrderType;
  shippingAddress: string;
  contactPhone: string;
  items: OrderItemRequest[];
}

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusValues = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export const OrderType = {
  DELIVERY: 'DELIVERY',
  PICKUP: 'PICKUP',
} as const;

export type OrderType = typeof OrderType[keyof typeof OrderType];

export const OrderTypeValues = ['DELIVERY', 'PICKUP'] as const;

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

