import { Link } from 'react-router-dom';
import { useCart } from '@/cart';
import { useCartStock } from '@/hooks/useCartStock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Public cart view (a guest can see their cart). "Proceed to checkout" goes to /checkout, which is
// gated by RequireAuth — so a guest is asked to log in there, with the cart preserved.
export default function CartPage() {
  const { cartItems, totals, removeItem, clearCart, setItemQuantity } = useCart();
  const { lines, hasIssues } = useCartStock();

  // Line stock verdicts keyed the same way cart lines are, so we can flag each row.
  const stockByLine = new Map(lines.map((l) => [`${l.id}:${l.variantKey ?? ''}`, l]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Card data-testid="cart-page">
        <CardHeader>
          <CardTitle>Your cart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.length === 0 ? (
            <p data-testid="cart-empty" className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <>
              {hasIssues && (
                <div
                  className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
                  data-testid="cart-stock-warning"
                >
                  Some items are out of stock or exceed available quantity. Remove or reduce the
                  highlighted items to continue to checkout.
                </div>
              )}
              <ul className="divide-y" data-testid="cart-items">
                {cartItems.map((item) => {
                  const line = stockByLine.get(`${item.id}:${item.variantKey ?? ''}`);
                  const status = line?.status ?? 'ok';
                  const stock = line?.stock ?? null;
                  return (
                    <li key={`${item.id}:${item.variantKey ?? ''}`} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.unitPrice} × {item.quantity}</p>
                        {status === 'out' && (
                          <p className="text-sm font-semibold text-red-600" data-testid="cart-line-out">
                            Out of stock
                          </p>
                        )}
                        {status === 'insufficient' && (
                          <p className="text-sm font-semibold text-red-600" data-testid="cart-line-insufficient">
                            Only {stock} in stock —{' '}
                            <button
                              type="button"
                              className="underline"
                              onClick={() => stock != null && setItemQuantity(item.id, stock, item.variantKey)}
                            >
                              reduce to {stock}
                            </button>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">₹{item.unitPrice * item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid="cart-remove"
                          onClick={() => removeItem(item.id, item.variantKey)}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between border-t pt-3 font-semibold">
                <span>Total</span>
                <span data-testid="cart-total">₹{totals.total}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={clearCart} data-testid="cart-clear">Clear cart</Button>
                {hasIssues ? (
                  <Button className="flex-1" data-testid="cart-checkout" disabled>
                    Proceed to checkout
                  </Button>
                ) : (
                  <Button asChild className="flex-1" data-testid="cart-checkout">
                    <Link to="/checkout">Proceed to checkout</Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
