import type { JSX } from 'react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/cart/CartContext';
import { useCheckout } from '@/cart/useCheckout';
import type { CheckoutStep } from '@/cart/types';
import ShippingStep from '@/components/checkout/ShippingStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/routes';
import type { ShippingMethod } from '@/types/shipping';
import { toast } from 'sonner';
import type { OrderDto } from '@/types/order';

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

const CheckoutPage = (): React.JSX.Element => {
  const { cartItems, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);

  // No page-level validate on the shipping step: ShippingStep's own form (zod) is the source of
  // truth for completeness and only calls onNext with valid details. Gating next() on the
  // shippingDetails state here would race the setState in handleShippingNext (which runs next()
  // synchronously, before the state has re-rendered) and wedge the flow on the shipping step.
  const steps: CheckoutStep[] = [
    {
      id: 'shipping',
      label: 'Shipping Information',
    },
    {
      id: 'payment',
      label: 'Payment',
    },
  ];

  const { current, next, back, isFirst, isLast, error: checkoutError } = useCheckout(steps);

  const handleShippingNext = (details: ShippingDetails): void => {
    setShippingDetails(details);
    next();
  };

  const handlePaymentSuccess = (order: OrderDto): void => {
    clearCart();
    toast.success('Order placed successfully!');
    navigate(`${ROUTES.ORDER_CONFIRMATION}?orderId=${order.id}`);
  };

  if (cartItems.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-gray-600 mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)} className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            Continue Shopping
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-md border border-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              {checkoutError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{checkoutError}</span>
                </div>
              )}

              {current?.id === 'shipping' && (
                <ShippingStep onNext={handleShippingNext} />
              )}
              {current?.id === 'payment' && shippingDetails && (
                <PaymentStep shippingDetails={shippingDetails} onPaymentSuccess={handlePaymentSuccess} />
              )}

              <div className="flex justify-between mt-6">
                {!isFirst && (
                  <Button onClick={back} variant="outline" className="transition-all duration-200">
                    Back
                  </Button>
                )}
                {!isLast && current?.id === 'shipping' && shippingDetails && (
                  <Button onClick={next} className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
                    Proceed to Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;