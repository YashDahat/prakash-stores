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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Brand } from '@/types/brand';

const brandFormSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
});

interface BrandFormProps {
  initialData: Brand | null;
  onSubmit: (data: { name: string }) => void;
  onCancel: () => void;
}

export function BrandForm({
  initialData,
  onSubmit,
  onCancel,
}: BrandFormProps): React.JSX.Element {
  const form = useForm<z.infer<typeof brandFormSchema>>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
    },
  });

  const handleSubmit = (values: z.infer<typeof brandFormSchema>): void => {
    onSubmit({ name: values.name });
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Brand name" {...field} data-testid="brand-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel} data-testid="brand-form-cancel">
                Cancel
              </Button>
              <Button type="submit" data-testid="brand-form-submit">
                {initialData ? 'Save Changes' : 'Create Brand'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
