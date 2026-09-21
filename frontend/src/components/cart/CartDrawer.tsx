import type { JSX } from 'react';
import { useCart } from '@/cart/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps): React.JSX.Element {
  const { cartItems, totals, setItemQuantity, removeItem, clearCart, cartCount } = useCart();

  const handleQuantityChange = (itemId: string | number, currentQuantity: number, delta: number, variantKey?: string) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      setItemQuantity(itemId, newQuantity, variantKey);
    } else {
      removeItem(itemId, variantKey);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" /> Your Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p className="text-lg mb-4">Your cart is empty.</p>
              <SheetClose asChild>
                <Link to={ROUTES.PRODUCTS}>
                  <Button className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-6 py-3 transition-all duration-200">
                    Continue Shopping
                  </Button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.variantKey || ''}`} className="flex items-center gap-4 py-2">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-gray-600 text-xs">{formatCurrency(item.unitPrice)}</p>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1, item.variantKey)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (!isNaN(newQuantity) && newQuantity > 0) {
                            setItemQuantity(item.id, newQuantity, item.variantKey);
                          }
                        }}
                        className="w-12 text-center mx-1 h-6"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1, item.variantKey)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id, item.variantKey)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="font-semibold text-sm">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <Label>Subtotal:</Label>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.adjustments.map((adj) => (
                  <div key={adj.id} className="flex justify-between">
                    <Label>{adj.label}:</Label>
                    <span>{formatCurrency(adj.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base">
                  <Label>Total:</Label>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <Button
                variant="outline"
                className="w-full text-sm border-[#1A3A6D] text-[#1A3A6D] hover:bg-[#1A3A6D] hover:text-white font-semibold rounded-full transition-all duration-200"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Link to={ROUTES.CHECKOUT}>
              <Button
                className="w-full bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-6 py-3 transition-all duration-200"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}