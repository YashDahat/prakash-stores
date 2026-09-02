'use client';

import { useEffect } from 'react';
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
import { ShippingDetails } from '@/types/order';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ShippingAddressFormProps {
  initialData: ShippingDetails | undefined;
  onValidSubmit: (details: ShippingDetails) => void;
}

const formSchema = z.object({
  orderType: z.enum(['DELIVERY', 'PICKUP']),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const PRAKASH_STORES_ADDRESS =
  'Showroom No 1, 90 Madhukunj, Aundh Rd, Pune, Maharashtra 411020';

export default function ShippingAddressForm({
  initialData,
  onValidSubmit,
}: ShippingAddressFormProps): React.JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderType: initialData?.orderType || 'DELIVERY',
      shippingAddress: initialData?.shippingAddress || '',
      contactPhone: initialData?.contactPhone || '',
    },
  });

  const orderType = form.watch('orderType');

  useEffect(() => {
    if (orderType === 'PICKUP') {
      form.setValue('shippingAddress', PRAKASH_STORES_ADDRESS);
      form.clearErrors('shippingAddress');
    } else if (orderType === 'DELIVERY' && form.getValues('shippingAddress') === PRAKASH_STORES_ADDRESS) {
      form.setValue('shippingAddress', '');
    }
  }, [orderType, form]);

  const onSubmit = (values: z.infer<typeof formSchema>): void => {
    onValidSubmit({
      shippingAddress: values.shippingAddress,
      contactPhone: values.contactPhone,
      orderType: values.orderType,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="orderType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Order Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  data-testid="order-type-radio-group"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="DELIVERY" data-testid="delivery-radio" />
                    </FormControl>
                    <FormLabel className="font-normal">Delivery</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PICKUP" data-testid="pickup-radio" />
                    </FormControl>
                    <FormLabel className="font-normal">Click and Collect (Pickup)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shippingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your shipping address"
                  {...field}
                  disabled={orderType === 'PICKUP'}
                  data-testid="shipping-address-textarea"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your contact phone number"
                  {...field}
                  data-testid="contact-phone-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#E87A00] hover:bg-[#D46A00]" data-testid="shipping-address-submit">
          Continue to Payment
        </Button>
      </form>
    </Form>
  );
}