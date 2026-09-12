import { useNavigate } from 'react-router-dom';
import { useCart } from '@/cart/CartContext';
import CartItemsTable from '@/components/cart/CartItemsTable';
import CartSummary from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';

export default function CartPage() {
  const { cartItems, totals, setItemQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = (id: string | number, quantity: number, variantKey?: string) => {
    setItemQuantity(id, quantity, variantKey);
  };

  const handleRemoveItem = (id: string | number, variantKey?: string) => {
    removeItem(id, variantKey);
  };

  const handleProceedToCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#212121]" data-testid="cart-page-title">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
            <Button onClick={() => navigate(ROUTES.PRODUCTS)} className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200" data-testid="continue-shopping-cta">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <CartItemsTable
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>
            <div className="lg:col-span-1">
              <CartSummary totals={totals} onCheckout={handleProceedToCheckout} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}