import type { JSX } from 'react';
import React, { useState } from 'react';
import { useProducts, useCategories, useBrands } from '@/hooks/productHooks';
import type { ProductDto } from '@/types/product';
import ProductFilterSidebar from '@/components/products/ProductFilterSidebar';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductFilter {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}

const ProductsPage = (): React.JSX.Element => {
  const [filters, setFilters] = useState<ProductFilter>({});
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: brands, isLoading: isLoadingBrands } = useBrands();

  const handleFilterChange = (newFilters: ProductFilter): void => {
    setFilters(newFilters);
  };

  const filteredProducts = (products as unknown as ProductDto[] | undefined)?.filter((product: ProductDto) => {
    const matchesCategory = filters.categoryId ? product.categoryId === filters.categoryId : true;
    const matchesBrand = filters.brandId ? product.brandId === filters.brandId : true;
    const matchesMinPrice = filters.minPrice ? product.price >= filters.minPrice : true;
    const matchesMaxPrice = filters.maxPrice ? product.price <= filters.maxPrice : true;
    const matchesSearchTerm = filters.searchTerm
      ? product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesSearchTerm;
  }) || [];

  if (isLoadingProducts || isLoadingCategories || isLoadingBrands) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isErrorProducts) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center text-red-500">
          Failed to load products. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4">
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