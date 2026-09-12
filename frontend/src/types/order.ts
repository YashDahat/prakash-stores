// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

import type { ShippingAddressDto } from '@/types/shipping';

export interface OrderResponse {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddressDto;
  orderItems: OrderItemResponse[];
  paymentGatewayOrderId: string;
}

export interface UpdateOrderStatusRequest {
  newStatus: OrderStatus;
}

export interface CreateOrderRequest {
  orderItems: OrderItemRequest[];
  shippingAddress: ShippingAddressDto;
}

export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusValues = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export interface OrderItemResponse {
  productId: number;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

