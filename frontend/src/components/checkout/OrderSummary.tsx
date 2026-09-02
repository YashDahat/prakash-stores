import { CartItem, CartTotals, AdjustmentLine } from '@/cart/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  cartItems: CartItem[];
  totals: CartTotals;
}

export default function OrderSummary({ cartItems, totals }: OrderSummaryProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} x {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</p>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium">{formatCurrency(totals.subtotal)}</p>
          </div>

          {totals.adjustments.map((adjustment: AdjustmentLine) => (
            <div key={adjustment.id} className="flex justify-between">
              <p className="text-gray-600">{adjustment.label}</p>
              <p className="font-medium">{formatCurrency(adjustment.amount)}</p>
            </div>
          ))}

          <div className="flex justify-between text-lg font-bold pt-2">
            <p>Total</p>
            <p>{formatCurrency(totals.total)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}