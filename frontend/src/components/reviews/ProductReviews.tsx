import type { JSX } from 'react';
import React from 'react';
import { useReviewsByProductId } from '@/hooks/reviewHooks';
import { useAuth } from '@/context/AuthContext';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews = ({ productId }: ProductReviewsProps): React.JSX.Element => {
  const { data: reviews, isLoading } = useReviewsByProductId(productId);
  const { isAuthenticated, user } = useAuth();

  const handleReviewSubmitSuccess = (): void => {
    // review submitted — parent can handle cache invalidation if needed
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Rating: {review.rating}/5</CardTitle>
                <p className="text-sm text-gray-500">
                  By User {review.userId} on {new Date(review.reviewDate).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p>{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      )}

      <Separator className="my-8" />

      {isAuthenticated ? (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Submit Your Review</h3>
          <ReviewForm productId={productId} onSubmitSuccess={handleReviewSubmitSuccess} />
        </div>
      ) : (
        <p className="mt-8 text-gray-600">
          Please <a href="/login" className="text-[#E87A00] hover:underline">log in</a> to submit a review.
        </p>
      )}
    </section>
  );
};

export default ProductReviews;