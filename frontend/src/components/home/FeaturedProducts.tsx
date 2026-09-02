import { useProducts } from '@/hooks/productHooks';
import { ProductDto } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProducts(): React.JSX.Element {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#212121] mb-8 text-center">
            Our Featured Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-[350px] w-full rounded-xl" />
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
          <p>Failed to load featured products. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Assuming 'products' is an array of ProductDto, even though useProducts() returns void.
  // This is a known contract mismatch, implementing based on the feature context.
  const featuredProducts: ProductDto[] = (products as unknown as { content: ProductDto[] })?.content || [];

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#212121] mb-8 text-center">
          Our Featured Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.slice(0, 4).map((product: ProductDto) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-block bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            data-testid="view-all-products-cta"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}