import React, { useState } from 'react';
import { ProductDto } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/cart/CartContext';
import { toast } from 'sonner';

interface ProductDetailsProps {
  product: ProductDto;
}

export default function ProductDetails({ product }: ProductDetailsProps): React.JSX.Element {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0].size : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0].color : undefined
  );

  const availableSizes = Array.from(new Set(product.variants?.map(v => v.size) || []));
  const availableColors = Array.from(new Set(product.variants?.map(v => v.color) || []));

  const handleAddToCart = () => {
    let variantKey: string | undefined = undefined;
    if (selectedSize && selectedColor) {
      variantKey = `${selectedSize}-${selectedColor}`;
    } else if (selectedSize) {
      variantKey = selectedSize;
    } else if (selectedColor) {
      variantKey = selectedColor;
    }

    addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      imageUrl: product.imageUrl,
      variantKey: variantKey,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const formattedPrice = product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-[#212121]">{product.name}</h1>
      <p className="text-2xl font-semibold text-[#E87A00]">{formattedPrice}</p>
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <RadioGroup
            value={selectedSize}
            onValueChange={setSelectedSize}
            className="flex flex-wrap gap-2"
            data-testid="product-size-selector"
          >
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {availableColors.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-[180px]" data-testid="product-color-selector">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {availableColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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