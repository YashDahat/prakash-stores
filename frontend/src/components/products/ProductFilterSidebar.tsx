import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCategories, useBrands } from '@/hooks/productHooks';
import { ProductCategory, Brand } from '@/types/product';

interface ProductFilterSidebarProps {
  onFilterChange: (filters: {
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }) => void;
}

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({ onFilterChange }) => {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: brands, isLoading: isLoadingBrands } = useBrands();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleApplyFilters = (): void => {
    onFilterChange({
      categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
      brandId: selectedBrand ? parseInt(selectedBrand) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      searchTerm: searchTerm || undefined,
    });
  };

  const handleClearFilters = (): void => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    onFilterChange({});
  };

  return (
    <div className="w-full md:w-64 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      <div className="mb-4">
        <Label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category-filter" data-testid="category-filter">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {!isLoadingCategories &&
              categories?.map((category: ProductCategory) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </Label>
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger id="brand-filter" data-testid="brand-filter">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Brands</SelectItem>
            {!isLoadingBrands &&
              brands?.map((brand: Brand) => (
                <SelectItem key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1">
          Price Range
        </Label>
        <div className="flex space-x-2">
          <Input
            id="min-price"
            data-testid="min-price-input"
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value)}
            className="w-1/2"
          />
          <Input
            id="max-price"
            data-testid="max-price-input"
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value)}
            className="w-1/2"
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </Label>
        <Input
          id="search-term"
          data-testid="search-term-input"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col space-y-2">
        <Button
          onClick={handleApplyFilters}
          data-testid="apply-filters-button"
          className="w-full bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold transition-all duration-200"
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleClearFilters}
          data-testid="clear-filters-button"
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-100 transition-all duration-200"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;