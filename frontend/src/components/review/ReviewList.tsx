import { useAuth } from '@/context/AuthContext';
import { useReviewsByProductId } from '@/hooks/reviewHooks';
import { ReviewDto } from '@/types/review';
import { ReviewForm } from '@/components/review/ReviewForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface ReviewListProps {
  productId: number;
}

export function ReviewList({ productId }: ReviewListProps): React.JSX.Element {
  const { data: reviews, isLoading, isError, error } = useReviewsByProductId(productId);
  const { isAuthenticated, user } = useAuth();

  const handleReviewSubmitted = (newReview: ReviewDto): void => {
    // The useReviewsByProductId hook should automatically re-fetch or update its cache
    // after a new review is submitted via ReviewForm's useCreateReview hook.
    // No explicit re-fetch needed here.
    console.log('Review submitted:', newReview);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error loading reviews: {error?.message}</div>;
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Customer Reviews</h2>

        {isAuthenticated && user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
            </CardContent>
          </Card>
        )}

        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.userId}`} alt={`User ${review.userId}`} />
                      <AvatarFallback>{review.userId}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">User {review.userId}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-4 w-4',
                              i < review.rating ? 'text-[#E87A00] fill-[#E87A00]' : 'text-gray-300',
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </section>
  );
}