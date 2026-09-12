import React, { useState } from 'react';
import { useProducts, useCategories, useBrands, useSearchProducts } from '@/hooks/productHooks';
import ProductFilterSidebar from '@/components/product/ProductFilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductFilterRequest } from '@/types/product';
import { Skeleton } from '@/components/ui/skeleton';

const ProductsPage = () => {
  const [filters, setFilters] = useState<ProductFilterRequest>({});
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: productsError } = useSearchProducts(filters);
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, error: categoriesError } = useCategories();
  const { data: brands, isLoading: isLoadingBrands, isError: isErrorBrands, error: brandsError } = useBrands();

  const handleFilterChange = (newFilters: ProductFilterRequest) => {
    setFilters(newFilters);
  };

  if (isLoadingProducts || isLoadingCategories || isLoadingBrands) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isErrorProducts || isErrorCategories || isErrorBrands) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          <p>Error loading data:</p>
          {isErrorProducts && <p>{productsError?.message}</p>}
          {isErrorCategories && <p>{categoriesError?.message}</p>}
          {isErrorBrands && <p>{brandsError?.message}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilterSidebar
            onFilterChange={handleFilterChange}
            categories={categories || []}
            brands={brands || []}
          />
        </div>
        <div className="w-full md:w-3/4">
          <h2 className="text-3xl font-semibold mb-8 text-[#212121]">Our Products</h2>
          {products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-10 text-gray-600">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;