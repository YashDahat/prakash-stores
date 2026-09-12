import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewTable } from '@/components/admin/review/ReviewTable';
import { useReviews, useApproveReview, useDeleteReview } from '@/hooks/reviewHooks';
import { toast } from 'sonner';
import { ReviewDto } from '@/types/review';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdminReviewsPage() {
  const { data: reviews, isLoading, isError, error } = useReviews();
  const { mutate: approveReview, isPending: isApproving } = useApproveReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<ReviewDto | null>(null);

  const handleApprove = (review: ReviewDto): void => {
    approveReview(review.id, {
      onSuccess: () => {
        toast.success('Review approved successfully.');
      },
      onError: (err) => {
        toast.error(`Failed to approve review: ${err.message}`);
      },
    });
  };

  const handleDelete = (review: ReviewDto): void => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = (): void => {
    if (selectedReview) {
      deleteReview(selectedReview.id, {
        onSuccess: () => {
          toast.success('Review deleted successfully.');
          setIsDeleteDialogOpen(false);
          setSelectedReview(null);
        },
        onError: (err) => {
          toast.error(`Failed to delete review: ${err.message}`);
          setIsDeleteDialogOpen(false);
          setSelectedReview(null);
        },
      });
    }
  };

  const closeDeleteDialog = (): void => {
    setIsDeleteDialogOpen(false);
    setSelectedReview(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading reviews: {error?.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Review Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewTable
            reviews={reviews || []}
            onApprove={handleApprove}
            onDelete={handleDelete}
            isLoading={isLoading || isApproving || isDeleting}
            error={error}
          />
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the review by{' '}
              <span className="font-semibold">{selectedReview?.customerName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}