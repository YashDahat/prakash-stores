import ProductCard from '@/components/product/ProductCard';
import type { ProductDto } from '@/types/product';

interface ProductGridProps {
  products: ProductDto[];
}

export default function ProductGrid({ products }: ProductGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}