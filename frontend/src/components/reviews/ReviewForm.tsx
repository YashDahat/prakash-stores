import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useSubmitReview } from '@/hooks/reviewHooks';
import { toast } from 'sonner';
import { ReviewDto } from '@/types/review';

interface ReviewFormProps {
  productId: number;
  onSubmitSuccess: () => void;
}

const reviewFormSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional(),
});

export const ReviewForm = ({ productId, onSubmitSuccess }: ReviewFormProps): React.JSX.Element => {
  const { isAuthenticated } = useAuth();
  const { mutate: submitReview, isPending } = useSubmitReview();

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = (values: z.infer<typeof reviewFormSchema>): void => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to submit a review.');
      return;
    }

    const reviewData: Omit<ReviewDto, 'id' | 'userId' | 'reviewDate' | 'status'> = {
      productId: productId,
      rating: values.rating,
      comment: values.comment ?? '',
    };

    submitReview(reviewData as ReviewDto, {
      onSuccess: () => {
        toast.success('Review submitted successfully!');
        form.reset();
        onSubmitSuccess();
      },
      onError: (error) => {
        toast.error(`Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}`);
      },
    });
  };

  return (
    <div className="mt-8 p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      {!isAuthenticated ? (
        <p className="text-gray-600">Please log in to submit a review.</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter rating"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      min="1"
                      max="5"
                      data-testid="review-rating"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts on the product..."
                      {...field}
                      rows={4}
                      data-testid="review-comment"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold transition-all duration-200" data-testid="review-submit">
              {isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};