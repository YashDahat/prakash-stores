import type { JSX } from 'react';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/productHooks';
import type { ProductDto } from '@/types/product';
import ProductFilterSidebar, { type ProductFilterValues } from '@/components/products/ProductFilterSidebar';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

// Read the current filters straight from the URL so the page is fully driven by (and shareable via)
// query params, e.g. /products?category=Men or /products?brand=Levi's&maxPrice=2000.
const readFilters = (params: URLSearchParams): ProductFilterValues => ({
  category: params.get('category') ?? undefined,
  brand: params.get('brand') ?? undefined,
  minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
  maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
  search: params.get('search') ?? undefined,
});

const ProductsPage = (): React.JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);

  const { data: products, isLoading, isError } = useProducts();

  const handleFilterChange = (next: ProductFilterValues): void => {
    const params = new URLSearchParams();
    if (next.category) params.set('category', next.category);
    if (next.brand) params.set('brand', next.brand);
    if (next.minPrice != null) params.set('minPrice', String(next.minPrice));
    if (next.maxPrice != null) params.set('maxPrice', String(next.maxPrice));
    if (next.search) params.set('search', next.search);
    setSearchParams(params, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const list = (products ?? []) as ProductDto[];
    const cat = filters.category?.toLowerCase();
    const brand = filters.brand?.toLowerCase();
    const term = filters.search?.toLowerCase();
    return list.filter((product) => {
      // Category matches by prefix so a gender param ("Men") catches "Men's Shirts", "Men's Jeans", …
      // while an exact category name still matches itself.
      const matchesCategory = cat ? (product.categoryName ?? '').toLowerCase().startsWith(cat) : true;
      const matchesBrand = brand ? (product.brandName ?? '').toLowerCase() === brand : true;
      const matchesMin = filters.minPrice != null ? product.price >= filters.minPrice : true;
      const matchesMax = filters.maxPrice != null ? product.price <= filters.maxPrice : true;
      const matchesTerm = term
        ? product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)
        : true;
      return matchesCategory && matchesBrand && matchesMin && matchesMax && matchesTerm;
    });
  }, [products, filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.search]);

  if (isLoading) {
    return (
      <section className="py-10 px-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64">
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-screen-2xl mx-auto text-center text-red-500">
          Failed to load products. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Floating filter panel: stays in view while the product list scrolls. */}
        <aside className="w-full md:w-64 md:shrink-0 md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
          <ProductFilterSidebar values={filters} onFilterChange={handleFilterChange} />
        </aside>
        <div className="w-full flex-1">
          <p className="mb-4 text-sm text-muted-foreground">{filteredProducts.length} product(s)</p>
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center text-gray-500 py-10">No products found matching your criteria.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
