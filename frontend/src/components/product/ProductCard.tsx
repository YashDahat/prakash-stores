import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/cart/CartContext';
import { ProductDto } from '@/types/product';
import { ROUTES } from '@/routes';

interface ProductCardProps {
  product: ProductDto;
}

export default function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault(); // Prevent navigating to product detail page
    addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id.toString())} data-testid={`product-card-${product.id}`}>
      <Card className="h-full flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-semibold mb-2 line-clamp-2" data-testid={`product-card-name-${product.id}`}>
            {product.name}
          </CardTitle>
          <p className="text-gray-700 font-bold" data-testid={`product-card-price-${product.id}`}>
            {product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full transition-all duration-200"
            data-testid={`add-to-cart-cta-${product.id}`}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}