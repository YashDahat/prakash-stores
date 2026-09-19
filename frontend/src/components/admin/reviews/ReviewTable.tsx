import { ReviewDto, ReviewStatus } from '@/types/review';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReviewTableProps {
  reviews: ReviewDto[];
  onApprove: (review: ReviewDto) => void;
  onReject: (review: ReviewDto) => void;
  onDelete: (review: ReviewDto) => void;
}

export function ReviewTable({
  reviews,
  onApprove,
  onReject,
  onDelete,
}: ReviewTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto">
      <Table data-testid="review-table">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id} data-testid={`review-row-${review.id}`}>
                <TableCell>{review.id}</TableCell>
                <TableCell>{review.productId}</TableCell>
                <TableCell>{review.userId}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                <TableCell>{new Date(review.reviewDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      review.status === ReviewStatus.APPROVED
                        ? 'bg-green-500'
                        : review.status === ReviewStatus.PENDING
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {review.status === ReviewStatus.PENDING && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(review)}
                        className="mr-2 hover:bg-green-100 transition-all duration-200"
                        data-testid={`approve-review-${review.id}-button`}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(review)}
                        className="mr-2 hover:bg-red-100 transition-all duration-200"
                        data-testid={`reject-review-${review.id}-button`}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(review)}
                    className="hover:bg-red-600 transition-all duration-200"
                    data-testid={`delete-review-${review.id}-button`}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}