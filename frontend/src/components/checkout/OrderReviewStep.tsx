import { CartItem, CartTotals } from '@/cart/types';
import { ShippingAddressDto } from '@/types/shipping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface OrderReviewStepProps {
  cartItems: CartItem[];
  shippingAddress: ShippingAddressDto;
  deliveryMethod: 'standard' | 'clickAndCollect';
  totals: CartTotals;
  onPlaceOrder: () => void;
}

export default function OrderReviewStep({
  cartItems,
  shippingAddress,
  deliveryMethod,
  totals,
  onPlaceOrder,
}: OrderReviewStepProps) {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(item.unitPrice)} x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.adjustments.map((adj) => (
                <div key={adj.id} className="flex justify-between">
                  <span>{adj.label}:</span>
                  <span>{formatCurrency(adj.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Name:</strong> {shippingAddress.fullName}
          </p>
          <p>
            <strong>Address:</strong> {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
            {shippingAddress.state} - {shippingAddress.postalCode}
          </p>
          <p>
            <strong>Phone:</strong> {shippingAddress.phoneNumber}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="capitalize">{deliveryMethod.replace(/([A-Z])/g, ' $1')}</p>
        </CardContent>
      </Card>

      <Button
        onClick={onPlaceOrder}
        className="w-full bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
        data-testid="place-order-cta"
      >
        Place Order
      </Button>
    </div>
  );
}