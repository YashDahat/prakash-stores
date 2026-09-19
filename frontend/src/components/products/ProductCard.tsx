import { Link } from 'react-router-dom';
import { ProductDto } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/cart/CartContext';
import { ROUTES } from '@/routes';

interface ProductCardProps {
  product: ProductDto;
}

export default function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const { addItem } = useCart();

  const handleAddToCart = (): void => {
    addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-200 hover:shadow-lg">
      <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id.toString())}>
        <CardHeader className="p-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
            data-testid={`product-card-image-${product.id}`}
          />
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id.toString())}>
          <CardTitle className="text-lg font-semibold text-[#212121] mb-2 line-clamp-2" data-testid={`product-card-name-${product.id}`}>
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-xl font-bold text-[#E87A00]" data-testid={`product-card-price-${product.id}`}>
          ₹{product.price.toLocaleString('en-IN')}
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
  );
}