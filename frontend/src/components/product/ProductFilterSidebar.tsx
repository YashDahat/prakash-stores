import React, { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/productHooks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductFilterRequest, ProductCategoryDto, BrandDto } from '@/types/product';
import { getAllProductCategories, getAllBrands } from '@/services/productService';
import { toast } from 'sonner';

interface ProductFilterSidebarProps {
  onFilterChange: (filters: ProductFilterRequest) => void;
}

export default function ProductFilterSidebar({
  onFilterChange,
}: ProductFilterSidebarProps): React.JSX.Element {
  const [categories, setCategories] = useState<ProductCategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minPriceInput, setMinPriceInput] = useState<string>('0');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('10000');

  useEffect(() => {
    const fetchFilterOptions = async (): Promise<void> => {
      try {
        const fetchedCategories = await getAllProductCategories();
        setCategories(fetchedCategories);
        const fetchedBrands = await getAllBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
        toast.error('Failed to load filter options.');
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setMinPriceInput(priceRange[0].toString());
    setMaxPriceInput(priceRange[1].toString());
  }, [priceRange]);

  const handleFilterApply = (): void => {
    const filters: ProductFilterRequest = {
      categoryId: selectedCategory,
      brandId: selectedBrand,
      size: selectedSize,
      color: selectedColor,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };
    onFilterChange(filters);
  };

  const handleClearFilters = (): void => {
    setSelectedCategory(undefined);
    setSelectedBrand(undefined);
    setSelectedSize(undefined);
    setSelectedColor(undefined);
    setPriceRange([0, 10000]);
    setMinPriceInput('0');
    setMaxPriceInput('10000');
    onFilterChange({});
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setMinPriceInput(value);
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setMaxPriceInput(value);
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  // Dummy data for sizes and colors as they are not available from API directly
  const availableSizes = ['S', 'M', 'L', 'XL'];
  const availableColors = ['Red', 'Blue', 'Green', 'Black', 'White'];

  return (
    <div className="w-full md:w-64 p-4 bg-white rounded-xl shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-semibold text-[#212121]">Filters</h3>
      <Separator />

      <Accordion type="multiple" defaultValue={['category', 'brand', 'price', 'size', 'color']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-medium text-[#212121]">Category</AccordionTrigger>
          <AccordionContent>
            <Select
              value={selectedCategory?.toString() || ''}
              onValueChange={(value) => setSelectedCategory(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="font-medium text-[#212121]">Brand</AccordionTrigger>
          <AccordionContent>
            <Select
              value={selectedBrand?.toString() || ''}
              onValueChange={(value) => setSelectedBrand(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="font-medium text-[#212121]">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={(value: [number, number]) => setPriceRange(value)}
                className="w-full"
              />
              <div className="flex justify-between items-center gap-2">
                <Input
                  type="number"
                  value={minPriceInput}
                  onChange={handleMinPriceChange}
                  className="w-1/2"
                  min={0}
                  max={priceRange[1]}
                />
                <span>-</span>
                <Input
                  type="number"
                  value={maxPriceInput}
                  onChange={handleMaxPriceChange}
                  className="w-1/2"
                  min={priceRange[0]}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="font-medium text-[#212121]">Size</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {availableSizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSize === size}
                    onCheckedChange={(checked) => setSelectedSize(checked ? size : undefined)}
                  />
                  <Label htmlFor={`size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="font-medium text-[#212121]">Color</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {availableColors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColor === color}
                    onCheckedChange={(checked) => setSelectedColor(checked ? color : undefined)}
                  />
                  <Label htmlFor={`color-${color}`}>{color}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleFilterApply}
          className="w-full bg-[#1A3A6D] hover:bg-[#1A3A6D]/90 text-white font-semibold transition-all duration-200"
          data-testid="apply-filters-button"
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full border-[#1A3A6D] text-[#1A3A6D] hover:bg-[#1A3A6D] hover:text-white font-semibold transition-all duration-200"
          data-testid="clear-filters-button"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}