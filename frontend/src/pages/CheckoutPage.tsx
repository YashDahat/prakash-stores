import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/cart/CartContext';
import { useCheckout } from '@/cart/useCheckout';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import DeliveryOptions from '@/components/checkout/DeliveryOptions';
import OrderReviewStep from '@/components/checkout/OrderReviewStep';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreateOrderRequest, OrderItemRequest, ShippingAddressDto } from '@/types/order';
import { useCreateOrder } from '@/hooks/orderHooks';
import { toast } from 'sonner';
import { ROUTES } from '@/routes';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totals, clearCart } = useCart();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddressDto | undefined>(undefined);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'clickAndCollect'>('standard');
  const [paymentGatewayOrderId, setPaymentGatewayOrderId] = useState<string | null>(null);

  const steps = [
    { id: 'shipping', label: 'Shipping Address', validate: () => !!shippingAddress },
    { id: 'delivery', label: 'Delivery Options', validate: () => true },
    { id: 'review', label: 'Order Review', validate: () => !!shippingAddress && cartItems.length > 0 },
    { id: 'payment', label: 'Payment', validate: () => totals.total > 0 },
  ];

  const { current, next, back, progress, isFirst, isLast, error: checkoutError } = useCheckout(steps);

  const handleShippingSubmit = (address: ShippingAddressDto): void => {
    setShippingAddress(address);
    next();
  };

  const handleSelectDeliveryMethod = (method: 'standard' | 'clickAndCollect'): void => {
    setDeliveryMethod(method);
    next();
  };

  const handlePlaceOrder = async (): Promise<void> => {
    if (!shippingAddress || cartItems.length === 0) {
      toast.error('Shipping address or cart items are missing.');
      return;
    }

    try {
      const orderItems: OrderItemRequest[] = cartItems.map((item) => ({
        productId: Number(item.id),
        quantity: item.quantity,
      }));

      const orderRequest: CreateOrderRequest = {
        orderItems,
        shippingAddress,
      };

      const orderResponse = await createOrder(orderRequest);
      setPaymentGatewayOrderId(orderResponse.paymentGatewayOrderId);
      next(); // Move to payment step
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order.');
    }
  };

  const handlePaymentSuccess = (gatewayOrderId: string): void => {
    // In a real scenario, this would involve verifying the payment with the backend.
    // For this exercise, we assume success and clear the cart.
    clearCart();
    navigate(ROUTES.ORDER_CONFIRMATION, { state: { paymentGatewayOrderId: gatewayOrderId } });
    toast.success('Order placed successfully!');
  };

  const renderStepContent = () => {
    switch (current?.id) {
      case 'shipping':
        return (
          <ShippingAddressForm
            initialData={shippingAddress}
            onSubmit={handleShippingSubmit}
          />
        );
      case 'delivery':
        return (
          <DeliveryOptions
            selectedMethod={deliveryMethod}
            onSelectDeliveryMethod={handleSelectDeliveryMethod}
          />
        );
      case 'review':
        return (
          <OrderReviewStep
            cartItems={cartItems}
            shippingAddress={shippingAddress!}
            deliveryMethod={deliveryMethod}
            totals={totals}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            orderTotal={totals.total}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      default:
        return <p>Unknown step.</p>;
    }
  };

  if (cartItems.length === 0 && current?.id !== 'payment') {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty.</h1>
          <p className="text-lg text-gray-600">Please add items to your cart before proceeding to checkout.</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)} className="mt-6">
            Continue Shopping
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  {current?.label}
                </CardTitle>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-[#E87A00] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </CardHeader>
              <CardContent className="mt-6">
                {renderStepContent()}
              </CardContent>
              <div className="flex justify-between mt-8">
                {!isFirst && (
                  <Button variant="outline" onClick={back} data-testid="checkout-back-button">
                    Back
                  </Button>
                )}
                {!isLast && current?.id !== 'review' && current?.id !== 'shipping' && current?.id !== 'delivery' && (
                  <Button onClick={next} data-testid="checkout-next-button">
                    Next
                  </Button>
                )}
              </div>
              {checkoutError && (
                <p className="text-red-500 mt-4 text-center">{checkoutError}</p>
              )}
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </span>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-medium">
                    {totals.subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </span>
                </div>
                {totals.adjustments.map((adj) => (
                  <div key={adj.id} className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{adj.label}</span>
                    <span className="font-medium">
                      {adj.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </span>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {totals.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;