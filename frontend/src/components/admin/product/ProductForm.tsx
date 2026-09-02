import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductDto } from '@/types/product';
import { useEffect, useState } from 'react';
import { getAllProductCategories, getAllBrands } from '@/services/productService';
import { ProductCategoryDto, BrandDto } from '@/types/product';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock quantity cannot be negative'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  material: z.string().min(1, 'Material is required'),
  gender: z.string().min(1, 'Gender is required'),
  active: z.boolean(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
});

interface ProductFormProps {
  initialData: ProductDto | null;
  onSubmit: (data: ProductDto) => void;
  onCancel: () => void;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps): React.JSX.Element {
  const [categories, setCategories] = useState<ProductCategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [isLoadingBrands, setIsLoadingBrands] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoriesAndBrands = async (): Promise<void> => {
      try {
        const fetchedCategories = await getAllProductCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        toast.error('Failed to fetch categories.');
      } finally {
        setIsLoadingCategories(false);
      }

      try {
        const fetchedBrands = await getAllBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        toast.error('Failed to fetch brands.');
      } finally {
        setIsLoadingBrands(false);
      }
    };
    fetchCategoriesAndBrands();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      imageUrl: initialData?.imageUrl || '',
      stockQuantity: initialData?.stockQuantity || 0,
      size: initialData?.size || '',
      color: initialData?.color || '',
      material: initialData?.material || '',
      gender: initialData?.gender || '',
      active: initialData?.active ?? true,
      category: initialData?.category.name || '',
      brand: initialData?.brand.name || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>): void => {
    const selectedCategory = categories.find(cat => cat.name === values.category);
    const selectedBrand = brands.find(brand => brand.name === values.brand);

    if (!selectedCategory || !selectedBrand) {
      toast.error('Please select a valid category and brand.');
      return;
    }

    const productData: ProductDto = {
      id: initialData?.id || 0, // ID is 0 for new products, actual ID for existing
      name: values.name,
      description: values.description,
      price: values.price,
      imageUrl: values.imageUrl,
      stockQuantity: values.stockQuantity,
      size: values.size,
      color: values.color,
      material: values.material,
      gender: values.gender,
      active: values.active,
      category: selectedCategory,
      brand: selectedBrand,
      additionalImages: initialData?.additionalImages || [], // Assuming no changes to additional images in this form
      variants: initialData?.variants || [], // Assuming no changes to variants in this form
    };
    onSubmit(productData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} data-testid="product-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product Description" {...field} data-testid="product-description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="product-price" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} data-testid="product-image-url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stockQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} data-testid="product-stock-quantity" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input placeholder="e.g., M, L, XL" {...field} data-testid="product-size" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Red, Blue" {...field} data-testid="product-color" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cotton, Polyester" {...field} data-testid="product-material" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Male, Female, Unisex" {...field} data-testid="product-gender" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCategories}>
                <FormControl>
                  <SelectTrigger data-testid="product-category-select">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingBrands}>
                <FormControl>
                  <SelectTrigger data-testid="product-brand-select">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="product-active-switch"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="product-form-cancel">
            Cancel
          </Button>
          <Button type="submit" data-testid="product-form-submit">
            {initialData ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}