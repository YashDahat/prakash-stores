import React, { useState } from 'react';
import { ProductDto } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/cart/CartContext';
import { toast } from 'sonner';

interface ProductInfoProps {
  product: ProductDto;
}

export default function ProductInfo({ product }: ProductInfoProps): React.JSX.Element {
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1.');
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      imageUrl: product.imageUrl,
    }, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-[#212121]" data-testid="product-name">{product.name}</h1>
      <p className="text-2xl font-semibold text-[#E87A00]" data-testid="product-price">
        ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className="text-gray-700 leading-relaxed" data-testid="product-description">{product.description}</p>

      <div className="flex items-center space-x-4">
        <Label htmlFor="quantity" className="text-lg">Quantity:</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-24 text-center"
          data-testid="product-quantity-input"
        />
      </div>

      <Button
        onClick={handleAddToCart}
        className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
        data-testid="add-to-cart-cta"
      >
        Add to Cart
      </Button>
    </div>
  );
}