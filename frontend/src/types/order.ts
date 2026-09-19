// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

import type { ShippingMethod } from '@/types/shipping';

export interface OrderDto {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  shippingAddress: string;
  shippingMethod: ShippingMethod;
  paymentId: string;
  orderItems: OrderItemDto[];
}

export const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusValues = ['PENDING_PAYMENT', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export interface CreateOrderRequest {
  shippingAddress: string;
  shippingMethod: ShippingMethod;
  items: OrderItemRequest[];
}

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

