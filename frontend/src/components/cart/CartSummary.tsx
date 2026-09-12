import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CartTotals } from '@/cart/types';

interface CartSummaryProps {
  totals: CartTotals;
  onCheckout: () => void;
}

export default function CartSummary({ totals, onCheckout }: CartSummaryProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-lg">
          <span>Subtotal:</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>

        {totals.adjustments.map((adjustment) => (
          <div key={adjustment.id} className="flex justify-between text-lg">
            <span>{adjustment.label}:</span>
            <span>{formatCurrency(adjustment.amount)}</span>
          </div>
        ))}

        <Separator className="my-4" />

        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        className="w-full mt-6 bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
        data-testid="proceed-to-checkout-cta"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}