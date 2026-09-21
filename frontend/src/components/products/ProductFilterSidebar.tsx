import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCategories, useBrands } from '@/hooks/productHooks';
import { ProductCategory } from '@/types/product';
import type { Brand } from '@/types/brand';

export interface ProductFilterValues {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

interface ProductFilterSidebarProps {
  values: ProductFilterValues;
  onFilterChange: (values: ProductFilterValues) => void;
}

// Radix Select forbids an empty-string item value, so use a sentinel for the "All" option.
const ALL = '__all__';

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({ values, onFilterChange }) => {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const update = (patch: Partial<ProductFilterValues>): void => {
    onFilterChange({ ...values, ...patch });
  };

  // Include the active value as an option even if it isn't a known category/brand name (e.g. a gender
  // prefix like "Men" coming from the homepage links), so the dropdown can display it.
  const categoryOptions = Array.from(
    new Set([...(values.category ? [values.category] : []), ...((categories ?? []).map((c) => c.name))]),
  );
  const brandOptions = Array.from(
    new Set([...(values.brand ? [values.brand] : []), ...((brands ?? []).map((b) => b.name))]),
  );

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      <div className="mb-4">
        <Label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Category</Label>
        <Select
          value={values.category ?? ALL}
          onValueChange={(v) => update({ category: v === ALL ? undefined : v })}
        >
          <SelectTrigger id="category-filter" data-testid="category-filter">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Categories</SelectItem>
            {categoryOptions.map((name: string) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">Brand</Label>
        <Select
          value={values.brand ?? ALL}
          onValueChange={(v) => update({ brand: v === ALL ? undefined : v })}
        >
          <SelectTrigger id="brand-filter" data-testid="brand-filter">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Brands</SelectItem>
            {brandOptions.map((name: string) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700 mb-1">Price Range</Label>
        <div className="flex space-x-2">
          <Input
            data-testid="min-price-input"
            type="number"
            placeholder="Min"
            value={values.minPrice ?? ''}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2"
          />
          <Input
            data-testid="max-price-input"
            type="number"
            placeholder="Max"
            value={values.maxPrice ?? ''}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2"
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">Search</Label>
        <Input
          id="search-term"
          data-testid="search-term-input"
          type="text"
          placeholder="Search products..."
          value={values.search ?? ''}
          onChange={(e) => update({ search: e.target.value || undefined })}
        />
      </div>

      <Separator className="my-4" />

      <Button
        onClick={() => onFilterChange({})}
        data-testid="clear-filters-button"
        variant="outline"
        className="w-full border-gray-300 hover:bg-gray-100 transition-all duration-200"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default ProductFilterSidebar;
