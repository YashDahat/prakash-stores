import { CartItem } from '@/cart/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';

interface CartItemsTableProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string | number, quantity: number, variantKey?: string) => void;
  onRemoveItem: (id: string | number, variantKey?: string) => void;
}

export default function CartItemsTable({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsTableProps): React.JSX.Element {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number): void => {
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity, item.variantKey);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table data-testid="cart-items-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                Your cart is empty.
              </TableCell>
            </TableRow>
          ) : (
            cartItems.map((item) => (
              <TableRow key={`${item.id}-${item.variantKey || ''}`} data-testid={`cart-item-${item.id}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="h-12 w-12 object-cover rounded-md" />
                    )}
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      data-testid={`decrease-quantity-${item.id}`}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                      className="w-16 text-center"
                      data-testid={`quantity-input-${item.id}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      data-testid={`increase-quantity-${item.id}`}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveItem(item.id, item.variantKey)}
                    data-testid={`remove-item-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}