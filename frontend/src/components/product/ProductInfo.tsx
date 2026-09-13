import type { JSX } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductDto } from '@/types/product';
import { useCart } from '@/cart/CartContext';
import { toast } from 'sonner';

interface ProductInfoProps {
  product: ProductDto;
}

export default function ProductInfo({ product }: ProductInfoProps): React.JSX.Element {
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(0); // Allow clearing the input
    }
  };

  const handleAddToCart = (): void => {
    if (quantity > 0) {
      addItem({
        id: product.id,
        name: product.name,
        unitPrice: product.price,
        imageUrl: product.imageUrl,
      }, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } else {
      toast.error('Please enter a valid quantity.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-[#212121]">{product.name}</h1>
      <p className="text-gray-600 leading-relaxed">{product.description}</p>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-semibold text-[#1A3A6D]">
          ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        {product.stock > 0 ? (
          <span className="text-sm text-green-600">In Stock ({product.stock} available)</span>
        ) : (
          <span className="text-sm text-red-600">Out of Stock</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Label htmlFor="quantity" className="text-lg">Quantity:</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-24 text-center"
          data-testid="product-quantity-input"
        />
        <Button
          onClick={handleAddToCart}
          className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          disabled={product.stock === 0 || quantity === 0}
          data-testid="add-to-cart-button"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}