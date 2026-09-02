import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductFilterSidebar from '@/components/product/ProductFilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/productHooks';
import type { ProductDto, ProductFilterRequest } from '@/types/product';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFilterRequest>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const initialFilters: ProductFilterRequest = {};
    searchParams.forEach((value, key) => {
      if (key === 'categoryId' || key === 'brandId' || key === 'minPrice' || key === 'maxPrice') {
        initialFilters[key] = Number(value);
      } else if (key === 'searchTerm') {
        setSearchTerm(value);
        initialFilters[key] = value;
      } else {
        initialFilters[key] = value;
      }
    });
    setFilters(initialFilters);
  }, [searchParams]);

  const { data: productsPage, isLoading, isError, error } = useProducts(filters);
  const products: ProductDto[] = productsPage?.content || [];

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load products: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [isError, error]);

  const handleFilterChange = (newFilters: ProductFilterRequest): void => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      // Remove undefined or null values
      Object.keys(updatedFilters).forEach(key => {
        if (updatedFilters[key as keyof ProductFilterRequest] === undefined || updatedFilters[key as keyof ProductFilterRequest] === null || updatedFilters[key as keyof ProductFilterRequest] === '') {
          delete updatedFilters[key as keyof ProductFilterRequest];
        }
      });

      // Update URL search params
      const newSearchParams = new URLSearchParams();
      for (const key in updatedFilters) {
        if (updatedFilters[key as keyof ProductFilterRequest] !== undefined) {
          newSearchParams.set(key, String(updatedFilters[key as keyof ProductFilterRequest]));
        }
      }
      setSearchParams(newSearchParams);
      return updatedFilters;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleFilterChange({ searchTerm });
  };

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4">
          <form onSubmit={handleSearchSubmit} className="mb-8 flex gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
              data-testid="product-search-input"
            />
            <Button type="submit" data-testid="product-search-button">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </form>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-700">No products found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;