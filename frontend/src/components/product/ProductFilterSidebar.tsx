import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

import { useCategories } from '@/hooks/productHooks';
import { useBrands } from '@/hooks/brandHooks';
import type { ProductCategoryDto } from '@/types/product';
import type { BrandDto } from '@/types/brand';

interface ProductFilterRequest {
  query?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductFilterSidebarProps {
  onFilterChange: (filters: ProductFilterRequest) => void;
}

const filterSchema = z.object({
  categoryId: z.coerce.number().optional().nullable(),
  brandId: z.coerce.number().optional().nullable(),
  minPrice: z.coerce.number().optional().nullable(),
  maxPrice: z.coerce.number().optional().nullable(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({ onFilterChange }) => {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: brands, isLoading: isLoadingBrands } = useBrands();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      categoryId: undefined,
      brandId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    },
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const filters: ProductFilterRequest = {
        categoryId: value.categoryId ?? undefined,
        brandId: value.brandId ?? undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
      };
      onFilterChange(filters);
    });
    return () => subscription.unsubscribe();
  }, [form, onFilterChange, priceRange]);

  const handlePriceChange = (value: number[]): void => {
    setPriceRange([value[0], value[1]]);
    const filters: ProductFilterRequest = {
      categoryId: form.getValues('categoryId') ?? undefined,
      brandId: form.getValues('brandId') ?? undefined,
      minPrice: value[0] > 0 ? value[0] : undefined,
      maxPrice: value[1] < 10000 ? value[1] : undefined,
    };
    onFilterChange(filters);
  };

  const handleResetFilters = (): void => {
    form.reset({
      categoryId: undefined,
      brandId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    setPriceRange([0, 10000]);
    onFilterChange({});
  };

  return (
    <div className="w-full md:w-64 p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-6">
      <h3 className="text-xl font-semibold text-[#212121]">Filters</h3>
      <Separator />

      <div>
        <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700">Category</Label>
        <Select
          onValueChange={(value) => form.setValue('categoryId', value === 'all' ? undefined : Number(value))}
          value={form.watch('categoryId')?.toString() ?? 'all'}
        >
          <SelectTrigger id="category-filter" className="mt-1 w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {isLoadingCategories ? (
              <SelectItem value="loading" disabled>Loading categories...</SelectItem>
            ) : (
              categories?.map((category: ProductCategoryDto) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="brand-filter" className="text-sm font-medium text-gray-700">Brand</Label>
        <Select
          onValueChange={(value) => form.setValue('brandId', value === 'all' ? undefined : Number(value))}
          value={form.watch('brandId')?.toString() ?? 'all'}
        >
          <SelectTrigger id="brand-filter" className="mt-1 w-full">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {isLoadingBrands ? (
              <SelectItem value="loading" disabled>Loading brands...</SelectItem>
            ) : (
              brands?.map((brand: BrandDto) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="price-range" className="text-sm font-medium text-gray-700">Price Range</Label>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
        <Slider
          id="price-range"
          min={0}
          max={10000}
          step={100}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mt-4"
        />
      </div>

      <Button
        onClick={handleResetFilters}
        variant="outline"
        className="w-full border-[#1A3A6D] text-[#1A3A6D] hover:bg-gray-50 transition-all duration-200"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilterSidebar;