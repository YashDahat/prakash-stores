import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCreateOrder } from '@/hooks/orderHooks';
import { useCreatePaymentOrder, useVerifyPayment } from '@/hooks/paymentHooks';
import { CreateOrderRequest, Order, OrderDetailsForPayment } from '@/types/order';
import { PaymentOrderResponse, VerifyPaymentRequest } from '@/types/payment';
import { useCart } from '@/cart/CartContext';

interface PaymentSelectionProps {
  orderDetails: OrderDetailsForPayment;
  totalAmount: number;
  onOrderSuccess: (order: Order) => void;
  onOrderError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({
  orderDetails,
  totalAmount,
  onOrderSuccess,
  onOrderError,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('razorpay');
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutateAsync: createPaymentOrder, isPending: isCreatingPaymentOrder } = useCreatePaymentOrder();
  const { mutateAsync: verifyPayment, isPending: isVerifyingPayment } = useVerifyPayment();
  const { clearCart } = useCart();

  const isLoading = isCreatingOrder || isCreatingPaymentOrder || isVerifyingPayment;

  const handlePayment = async (): Promise<void> => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    try {
      const orderRequest: CreateOrderRequest = {
        ...orderDetails,
        paymentMethod: selectedPaymentMethod,
      };

      // Step 1: Create a payment order with the backend
      const paymentOrderResponse: PaymentOrderResponse = await createPaymentOrder({
        amount: totalAmount,
        currency: 'INR',
        referenceId: 'order_ref_' + Date.now(), // Unique reference for the payment gateway
      });

      // Step 2: Open Razorpay checkout
      const options: RazorpayOptions = {
        key: paymentOrderResponse.gatewayKeyId,
        amount: paymentOrderResponse.amount, // Amount in smallest currency unit (paise)
        currency: paymentOrderResponse.currency,
        name: 'Prakash Stores',
        description: 'Order Payment',
        order_id: paymentOrderResponse.gatewayOrderId,
        handler: async (response: RazorpayResponse): Promise<void> => {
          try {
            // Step 3: Verify payment with the backend
            const verificationRequest: VerifyPaymentRequest = {
              gatewayOrderId: response.razorpay_order_id,
              gatewayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };
            const verificationResult = await verifyPayment(verificationRequest);

            if (verificationResult.verified) {
              // Step 4: Create the actual order in the backend
              createOrder(orderRequest, {
                onSuccess: (order: Order) => {
                  toast.success('Order placed successfully!');
                  clearCart();
                  onOrderSuccess(order);
                },
                onError: (error) => {
                  toast.error(`Failed to place order: ${error.message}`);
                  onOrderError(error.message);
                },
              });
            } else {
              toast.error('Payment verification failed. Please try again.');
              onOrderError('Payment verification failed.');
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during payment verification.';
            toast.error(`Payment verification failed: ${errorMessage}`);
            onOrderError(errorMessage);
          }
        },
        prefill: {
          name: 'Customer Name', // Replace with actual user name if available
          email: 'customer@example.com', // Replace with actual user email if available
          contact: orderDetails.contactPhone,
        },
        theme: {
          color: '#E87A00',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during payment initiation.';
      toast.error(`Failed to initiate payment: ${errorMessage}`);
      onOrderError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-testid="payment-selection-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Payment Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-lg font-medium">
            Total Amount: <span className="text-[#E87A00] font-bold">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        </div>

        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={setSelectedPaymentMethod}
          className="grid gap-4"
          data-testid="payment-method-radio-group"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-gray-50 transition-colors duration-200">
            <RadioGroupItem value="razorpay" id="razorpay" data-testid="razorpay-radio" />
            <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
              <span className="font-medium">Razorpay (UPI, Cards, Net Banking)</span>
              <p className="text-sm text-gray-500">Secure payment via Razorpay gateway.</p>
            </Label>
          </div>
          {/* Add other payment methods here if needed */}
        </RadioGroup>

        <Button
          onClick={handlePayment}
          className="w-full mt-6 bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          disabled={isLoading}
          data-testid="place-order-button"
        >
          {isLoading ? 'Processing...' : 'Place Order & Pay'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSelection;