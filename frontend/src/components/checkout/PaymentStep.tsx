import React from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/cart/CartContext';
import { useCreateOrder } from '@/hooks/orderHooks';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { createPaymentOrder, verifyPayment } from '@/services/paymentService';
import type { CreateOrderRequest, OrderItemRequest, OrderDto } from '@/types/order';
import type { ShippingMethod } from '@/types/shipping';
import type { PaymentOrderResponse, VerifyPaymentRequest } from '@/types/payment';

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
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const navigate = useNavigate();

  const handlePayment = async (): Promise<void> => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before proceeding to payment.');
      navigate(ROUTES.PRODUCTS);
      return;
    }

    try {
      const amountInPaise = Math.round(totals.total * 100);
      const paymentOrderRequest = {
        amount: amountInPaise,
        currency: 'INR',
        referenceId: `order_${Date.now()}`,
      };

      const paymentOrderResponse: PaymentOrderResponse = await createPaymentOrder(paymentOrderRequest);

      const options = {
        key: paymentOrderResponse.gatewayKeyId,
        amount: paymentOrderResponse.amount,
        currency: paymentOrderResponse.currency,
        name: 'Prakash Stores',
        description: 'Order Payment',
        order_id: paymentOrderResponse.gatewayOrderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verificationRequest: VerifyPaymentRequest = {
              gatewayOrderId: response.razorpay_order_id,
              gatewayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };
            const verificationResponse = await verifyPayment(verificationRequest);

            if (verificationResponse.verified) {
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
            } else {
              toast.error('Payment verification failed. Please try again.');
            }
          } catch (error) {
            toast.error(`Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
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
      toast.error(`Failed to initiate payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#212121]">Payment Information</h2>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <p className="text-lg font-medium">Total Amount Due: ₹{totals.total.toLocaleString('en-IN')}</p>
        <Button
          onClick={handlePayment}
          className="mt-6 w-full bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          disabled={isCreatingOrder || totals.total === 0}
          data-testid="pay-now-button"
        >
          {isCreatingOrder ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;