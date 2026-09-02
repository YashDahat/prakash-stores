import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/cart/CartContext';
import { useCheckout } from '@/cart/useCheckout';
import ShippingAddressForm from '@/components/checkout/ShippingAddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentSelection from '@/components/checkout/PaymentSelection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateOrderRequest, OrderType, OrderResponse, OrderItemRequest } from '@/types/order';
import { ShippingDetails, OrderDetailsForPayment } from '@/types/order';
import { useCreateOrder } from '@/hooks/orderHooks';
import { toast } from 'sonner';
import { ROUTES } from '@/routes';

const CheckoutPage = () => {
  const { cartItems, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | undefined>(undefined);
  const [orderId, setOrderId] = useState<string | null>(null);

  const steps = React.useMemo(() => [
    { id: 'shipping', label: 'Shipping / Pickup' },
    { id: 'summary', label: 'Order Summary' },
    { id: 'payment', label: 'Payment' },
  ], []);

  const { current, next, back, goTo, progress } = useCheckout(steps);

  const handleShippingSubmit = (details: ShippingDetails): void => {
    setShippingDetails(details);
    next();
  };

  const handleOrderSuccess = (order: OrderResponse): void => {
    setOrderId(order.id.toString());
    clearCart();
    navigate(ROUTES.ORDER_CONFIRMATION, { state: { orderId: order.id } });
  };

  const handleOrderError = (error: string): void => {
    toast.error(`Order failed: ${error}`);
  };

  const orderDetailsForPayment: OrderDetailsForPayment | undefined = shippingDetails && cartItems.length > 0
    ? {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: shippingDetails.shippingAddress,
      contactPhone: shippingDetails.contactPhone,
      orderType: shippingDetails.orderType,
    }
    : undefined;

  if (cartItems.length === 0 && !orderId) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-lg text-gray-600 mb-8">Add some products to your cart to proceed to checkout.</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)} className="bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            Continue Shopping
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Checkout</h1>

        <div className="flex justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'w-1/3' : ''}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${current?.id === step.id ? 'bg-[#E87A00]' : 'bg-gray-400'}`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-lg ${current?.id === step.id ? 'text-[#E87A00] font-semibold' : 'text-gray-600'}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="flex-grow h-1 bg-gray-300 mx-4">
                  <div className="h-full bg-[#E87A00]" style={{ width: `${progress * 100}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardContent className="p-6 md:p-8">
            {current?.id === 'shipping' && (
              <ShippingAddressForm
                initialData={shippingDetails}
                onValidSubmit={handleShippingSubmit}
              />
            )}

            {current?.id === 'summary' && (
              <>
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-semibold mb-4">Order Summary</CardTitle>
                </CardHeader>
                <OrderSummary cartItems={cartItems} totals={totals} />
                <div className="flex justify-between mt-8">
                  <Button onClick={back} variant="outline" className="px-6 py-3 rounded-full">
                    Back
                  </Button>
                  <Button onClick={next} className="bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
                    Proceed to Payment
                  </Button>
                </div>
              </>
            )}

            {current?.id === 'payment' && orderDetailsForPayment && (
              <>
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-semibold mb-4">Payment</CardTitle>
                </CardHeader>
                <PaymentSelection
                  orderDetails={orderDetailsForPayment}
                  totalAmount={totals.total}
                  onOrderSuccess={handleOrderSuccess}
                  onOrderError={handleOrderError}
                />
                <div className="flex justify-between mt-8">
                  <Button onClick={back} variant="outline" className="px-6 py-3 rounded-full">
                    Back
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CheckoutPage;