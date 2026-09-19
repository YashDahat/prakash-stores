import { useCart } from '@/cart/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

export default function OrderSummary(): React.JSX.Element {
  const { cartItems, totals } = useCart();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex-1">
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
              <p>Subtotal:</p>
              <p className="font-medium">{formatCurrency(totals.subtotal)}</p>
            </div>
            {totals.adjustments.map((adjustment) => (
              <div key={adjustment.id} className="flex justify-between">
                <p>{adjustment.label}:</p>
                <p className="font-medium">{formatCurrency(adjustment.amount)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <p>Total:</p>
              <p>{formatCurrency(totals.total)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for currency formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};