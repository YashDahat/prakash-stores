import type { JSX } from 'react';
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
import type { BrandDto } from '@/types/brand';

const formSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  description: z.string().optional(),
});

interface BrandFormProps {
  initialData: BrandDto | null;
  onSubmit: (data: Partial<BrandDto>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function BrandForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: BrandFormProps): React.JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>): void => {
    onSubmit({
      name: values.name,
      description: values.description,
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
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand name" {...field} data-testid="brand-name" />
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
                <Textarea placeholder="Enter brand description" {...field} data-testid="brand-description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#E87A00] hover:bg-[#D46B00]">
            {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Brand'}
          </Button>
        </div>
      </form>
    </Form>
  );
}