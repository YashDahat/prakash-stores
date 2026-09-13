import { useProducts } from '@/hooks/productHooks';
import ProductCard from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedProducts() {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-[350px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center text-red-500">
          <p>Error loading featured products: {error?.message}</p>
        </div>
      </section>
    );
  }

  const featuredProducts = products?.slice(0, 4) || []; // Display up to 4 featured products

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Featured Products</h2>
        {featuredProducts.length === 0 ? (
          <div className="text-center text-gray-500">No featured products available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}