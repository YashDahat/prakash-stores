import { ProductDto } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';

interface ProductGridProps {
  products: ProductDto[];
}

export function ProductGrid({ products }: ProductGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}