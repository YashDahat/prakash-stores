import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { ProductDto } from '@/types/product';
import { useBrands, useCategories } from '@/hooks/productHooks'; // Assuming these hooks are in productHooks
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductFormProps {
  initialData: ProductDto | null;
  onSubmit: (data: Partial<ProductDto>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
  categoryId: z.coerce.number().min(1, 'Category is required'),
  brandId: z.coerce.number().min(1, 'Brand is required'),
});

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps): React.JSX.Element {
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      stock: initialData?.stock ?? 0,
      imageUrl: initialData?.imageUrl ?? '',
      categoryId: initialData?.categoryId ?? 0,
      brandId: initialData?.brandId ?? 0,
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: brands, isLoading: isLoadingBrands } = useBrands();

  const handleSubmit = (values: z.infer<typeof productFormSchema>): void => {
    onSubmit({
      name: values.name,
      description: values.description,
      price: values.price,
      stock: values.stock,
      imageUrl: values.imageUrl,
      categoryId: values.categoryId,
      brandId: values.brandId,
    });
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
                <Input placeholder="Enter product name" {...field} data-testid="product-name" />
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
                <Textarea placeholder="Enter product description" {...field} data-testid="product-description" />
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
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} data-testid="product-stock" />
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
                <Input placeholder="Enter image URL" {...field} data-testid="product-imageUrl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value === 0 ? '' : String(field.value)} disabled={isLoadingCategories || isLoading}>
                <FormControl>
                  <SelectTrigger data-testid="product-category-select">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingCategories ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    categories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value === 0 ? '' : String(field.value)} disabled={isLoadingBrands || isLoading}>
                <FormControl>
                  <SelectTrigger data-testid="product-brand-select">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingBrands ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    brands?.map((brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} data-testid="product-form-cancel">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} data-testid="product-form-submit">
            {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}