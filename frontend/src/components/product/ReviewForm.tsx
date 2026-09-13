import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCreateReview } from '@/hooks/reviewHooks';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star } from 'lucide-react';

const reviewFormSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must not exceed 500 characters'),
});

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps): React.JSX.Element {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { mutate: createReview, isPending, isError, error } = useCreateReview();
  const [hoveredRating, setHoveredRating] = useState(0);

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

    createReview(
      {
        productId,
        rating: values.rating,
        comment: values.comment,
      },
      {
        onSuccess: () => {
          toast.success('Review submitted successfully!');
          form.reset();
          onReviewSubmitted();
        },
        onError: (err) => {
          toast.error(`Failed to submit review: ${err.message}`);
        },
      }
    );
  };

  if (authLoading) {
    return <p>Loading authentication status...</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-semibold">Please log in to submit a review.</p>
        {/* Link to login page is handled by the parent component or global auth flow */}
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <Star
                        key={starValue}
                        className={`cursor-pointer transition-colors duration-200 ${
                          (hoveredRating || field.value) >= starValue
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                        size={24}
                        onClick={() => field.onChange(starValue)}
                        onMouseEnter={() => setHoveredRating(starValue)}
                        onMouseLeave={() => setHoveredRating(0)}
                        data-testid={`rating-star-${starValue}`}
                      />
                    ))}
                    <Input type="hidden" {...field} />
                  </div>
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
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="Share your thoughts on this product..." {...field} rows={4} data-testid="review-comment" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200" disabled={isPending} data-testid="review-submit">
            {isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
          {isError && <p className="text-red-500 mt-2">Error: {error?.message}</p>}
        </form>
      </Form>
    </div>
  );
}