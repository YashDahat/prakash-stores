import { useCart } from '@/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { CartItemsTable } from '@/components/cart/CartItemsTable';
import { CartSummary } from '@/components/cart/CartSummary';

export default function CartPage() {
  const { cartItems, totals, cartCount } = useCart();

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-8">Your Shopping Cart</h1>

        {cartCount === 0 ? (
          <Card className="p-8 text-center">
            <CardTitle className="text-2xl font-semibold mb-4">Your cart is empty</CardTitle>
            <CardContent>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild className="bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold px-6 py-3 transition-all duration-200">
                <Link to={ROUTES.PRODUCTS}>Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItemsTable cartItems={cartItems} />
            </div>
            <div className="lg:col-span-1">
              <CartSummary cartItems={cartItems} totals={totals} />
              <Button asChild className="w-full mt-6 bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold px-6 py-3 transition-all duration-200" data-testid="proceed-to-checkout-cta">
                <Link to={ROUTES.CHECKOUT}>Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}