import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/cart/CartContext';
import { useCartStock } from '@/hooks/useCartStock';
import { useCreateOrder } from '@/hooks/orderHooks';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { createPaymentOrder, verifyPayment } from '@/services/paymentService';
import axios from 'axios';
import type { CreateOrderRequest, OrderItemRequest, OrderDto } from '@/types/order';
import type { ShippingMethod } from '@/types/shipping';
import type { PaymentOrderResponse, VerifyPaymentRequest } from '@/types/payment';

// The demo payment gateway (used when no Razorpay keys are configured) reports this as its
// public key and accepts any signature. When we see it, skip the Razorpay SDK and place the
// order directly so the checkout flow works end to end without real gateway credentials.
const DEMO_GATEWAY_KEY = 'demo_key';

// Pull the human-readable reason out of an API failure. The backend's GlobalExceptionHandler
// returns { message } on 4xx/5xx (e.g. "Insufficient stock for product: …"); fall back to the
// raw Error message for network/other failures.
const errorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
};

interface ShippingDetails {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  shippingMethod: ShippingMethod;
}

interface PaymentStepProps {
  shippingDetails: ShippingDetails;
  onPaymentSuccess: (order: OrderDto) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: any) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

const PaymentStep: React.FC<PaymentStepProps> = ({ shippingDetails, onPaymentSuccess }) => {
  const { cartItems, totals, clearCart } = useCart();
  const { lines: stockLines, hasIssues: hasStockIssues } = useCartStock();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const navigate = useNavigate();

  // Verify the payment, then create the order and hand off to the confirmation flow. Shared by
  // both the real Razorpay handler and the demo path.
  const finalizeOrder = async (verificationRequest: VerifyPaymentRequest): Promise<void> => {
    try {
      const verificationResponse = await verifyPayment(verificationRequest);
      if (!verificationResponse.verified) {
        toast.error('Payment verification failed. Please try again.');
        return;
      }

      const orderItems: OrderItemRequest[] = cartItems.map((item) => ({
        productId: item.id as number,
        quantity: item.quantity,
      }));

      const orderRequest: CreateOrderRequest = {
        shippingAddress: `${shippingDetails.fullName}, ${shippingDetails.addressLine1}, ${shippingDetails.addressLine2}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.pincode}, Phone: ${shippingDetails.phoneNumber}`,
        shippingMethod: shippingDetails.shippingMethod,
        items: orderItems,
      };

      const newOrder = await createOrder(orderRequest);
      clearCart();
      toast.success('Payment successful and order placed!');
      onPaymentSuccess(newOrder);
    } catch (error) {
      toast.error(`Failed to place order: ${errorMessage(error)}`);
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before proceeding to payment.');
      navigate(ROUTES.PRODUCTS);
      return;
    }

    // Don't take a (demo) payment for a cart we know the backend will reject. Send the shopper
    // back to the cart to remove/reduce the offending lines. The backend still re-validates.
    if (hasStockIssues) {
      const bad = stockLines.filter((l) => l.status !== 'ok').map((l) => l.name).join(', ');
      toast.error(`Some items are unavailable: ${bad}. Update your cart before paying.`);
      navigate(ROUTES.CART);
      return;
    }

    try {
      // Backend expects the amount in major units (rupees) and converts to minor units itself.
      const paymentOrderRequest = {
        amount: totals.total,
        currency: 'INR',
        referenceId: `order_${Date.now()}`,
      };

      const paymentOrderResponse: PaymentOrderResponse = await createPaymentOrder(paymentOrderRequest);

      // Demo mode: no real gateway credentials — skip the Razorpay SDK and place the order directly.
      const isDemoMode =
        paymentOrderResponse.gatewayKeyId === DEMO_GATEWAY_KEY || typeof window.Razorpay === 'undefined';
      if (isDemoMode) {
        await finalizeOrder({
          gatewayOrderId: paymentOrderResponse.gatewayOrderId,
          gatewayPaymentId: `demo_pay_${Date.now()}`,
          signature: 'demo_signature',
        });
        return;
      }

      const options = {
        key: paymentOrderResponse.gatewayKeyId,
        amount: paymentOrderResponse.amount,
        currency: paymentOrderResponse.currency,
        name: 'Prakash Stores',
        description: 'Order Payment',
        order_id: paymentOrderResponse.gatewayOrderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          await finalizeOrder({
            gatewayOrderId: response.razorpay_order_id,
            gatewayPaymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: shippingDetails.fullName,
          contact: shippingDetails.phoneNumber,
        },
        theme: {
          color: '#E87A00',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(`Failed to initiate payment: ${errorMessage(error)}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#212121]">Payment Information</h2>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <p className="text-lg font-medium">Total Amount Due: ₹{totals.total.toLocaleString('en-IN')}</p>
        {/* Demo project: no real payment gateway is configured, so "Pay Now" simulates a
            successful payment and places the order immediately. */}
        <div
          className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          data-testid="demo-payment-notice"
        >
          <strong>Demo mode:</strong> this is a demonstration store — no real payment is taken.
          Clicking <strong>Pay Now</strong> auto-approves the payment and places your order.
        </div>
        {hasStockIssues && (
          <div
            className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            data-testid="payment-stock-warning"
          >
            Some items in your cart are out of stock or exceed available quantity.{' '}
            <button type="button" className="underline font-semibold" onClick={() => navigate(ROUTES.CART)}>
              Update your cart
            </button>{' '}
            before paying.
          </div>
        )}
        <Button
          onClick={handlePayment}
          className="mt-6 w-full bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          disabled={isCreatingOrder || totals.total === 0 || hasStockIssues}
          data-testid="pay-now-button"
        >
          {isCreatingOrder ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;