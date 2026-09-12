import { useReviewsByProductId } from '@/hooks/reviewHooks';
import { ReviewDto } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ReviewForm from '@/components/product/ReviewForm';
import { useState } from 'react';

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: reviews, isLoading, isError, error } = useReviewsByProductId(productId);
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Optionally, re-fetch reviews or update UI
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

  if (isError) {
    return <div className="text-red-500">Error loading reviews: {error?.message}</div>;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review: ReviewDto) => (
            <Card key={review.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="font-medium">{review.customerName}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </CardTitle>
                <p className="text-sm text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      )}

      <div className="mt-8">
        {isAuthenticated ? (
          <>
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
          </>
        ) : (
          <p className="text-gray-600">Please log in to write a review.</p>
        )}
      </div>
    </section>
  );
}