import type { JSX } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReviewDto } from '@/types/review';
import { ReviewModerationActions } from './ReviewModerationActions';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewTableProps {
  reviews: ReviewDto[];
  onApprove: (review: ReviewDto) => void;
  onDelete: (review: ReviewDto) => void;
  isLoading: boolean;
  error: Error | null;
}

export function ReviewTable({
  reviews,
  onApprove,
  onDelete,
  isLoading,
  error,
}: ReviewTableProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-8">No reviews found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id} data-testid={`review-row-${review.id}`}>
              <TableCell>{review.productId}</TableCell>
              <TableCell>{review.customerName}</TableCell>
              <TableCell>{review.rating}</TableCell>
              <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
              <TableCell>{new Date(review.reviewDate).toLocaleDateString()}</TableCell>
              <TableCell>{review.status}</TableCell>
              <TableCell className="text-right">
                <ReviewModerationActions
                  review={review}
                  onApprove={() => onApprove(review)}
                  onDelete={() => onDelete(review)}
                  isApproving={false} // Placeholder, actual state managed by parent
                  isDeleting={false} // Placeholder, actual state managed by parent
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}