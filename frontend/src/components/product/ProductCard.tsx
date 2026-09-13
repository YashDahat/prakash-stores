import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/cart/CartContext';
import { ROUTES } from '@/routes';
import type { ProductDto } from '@/types/product';

interface ProductCardProps {
  product: ProductDto;
}

export default function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      imageUrl: product.imageUrl,
    });
  };

  const formattedPrice = product.price.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-md border border-gray-100 p-0 transition-all duration-200 hover:shadow-lg" data-testid={`product-card-${product.id}`}>
      <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id.toString())} className="block">
        <CardHeader className="p-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
      </Link>
      <CardContent className="flex-grow p-4">
        <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id.toString())}>
          <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</CardTitle>
        </Link>
        <p className="text-gray-700 font-bold">{formattedPrice}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-4 py-2 transition-all duration-200"
          data-testid={`add-to-cart-button-${product.id}`}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}