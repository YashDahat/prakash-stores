import { ReviewTable } from '@/components/admin/reviews/ReviewTable';
import { useApproveReview, useDeleteReview, useRejectReview, useReviews } from '@/hooks/reviewHooks';
import { ReviewDto } from '@/types/review';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminReviewsPage() {
  const { data: reviews, isLoading, isError, error } = useReviews();
  const { mutate: approveReview } = useApproveReview();
  const { mutate: rejectReview } = useRejectReview();
  const { mutate: deleteReview } = useDeleteReview();

  const handleApprove = (review: ReviewDto): void => {
    approveReview(review.id, {
      onSuccess: () => {
        toast.success('Review approved successfully!');
      },
      onError: (err) => {
        toast.error(`Failed to approve review: ${err.message}`);
      },
    });
  };

  const handleReject = (review: ReviewDto): void => {
    rejectReview(review.id, {
      onSuccess: () => {
        toast.success('Review rejected successfully!');
      },
      onError: (err) => {
        toast.error(`Failed to reject review: ${err.message}`);
      },
    });
  };

  const handleDelete = (review: ReviewDto): void => {
    deleteReview(review.id, {
      onSuccess: () => {
        toast.success('Review deleted successfully!');
      },
      onError: (err) => {
        toast.error(`Failed to delete review: ${err.message}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error loading reviews: {error?.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Review Moderation</h1>
      <ReviewTable
        reviews={reviews || []}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    </div>
  );
}