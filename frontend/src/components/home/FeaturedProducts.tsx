import type { JSX } from 'react';
import { useProducts } from '@/hooks/productHooks';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProductDto } from '@/types/product';

export default function FeaturedProducts(): React.JSX.Element {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-[350px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !products) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          Failed to load featured products. Please try again later.
        </div>
      </section>
    );
  }

  const featuredProducts = (products as unknown as ProductDto[]).slice(0, 8); // Display first 8 products as featured

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}