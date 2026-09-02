import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useCreateReview } from '@/hooks/reviewHooks';
import { CreateReviewRequest, ReviewDto } from '@/types/review';

const reviewFormSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must not exceed 500 characters'),
});

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: (review: ReviewDto) => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps): React.JSX.Element {
  const { isAuthenticated } = useAuth();
  const { mutate: createReview, isPending } = useCreateReview();
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

    const request: CreateReviewRequest = {
      productId: productId,
      rating: values.rating,
      comment: values.comment,
    };

    createReview(request, {
      onSuccess: (review) => {
        toast.success('Review submitted successfully!');
        form.reset();
        onReviewSubmitted(review);
      },
      onError: (error) => {
        toast.error(`Failed to submit review: ${error.message}`);
      },
    });
  };

  const renderStars = (currentRating: number): React.JSX.Element[] => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-6 w-6 cursor-pointer transition-colors duration-200 ${
            (hoveredRating || currentRating) >= i ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => form.setValue('rating', i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white" data-testid="review-form">
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
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1" data-testid="review-rating-input">
                      {renderStars(field.value)}
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
                    <Textarea
                      placeholder="Share your thoughts on this product..."
                      className="resize-y min-h-[100px]"
                      {...field}
                      data-testid="review-comment-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
              disabled={isPending}
              data-testid="review-submit"
            >
              {isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}