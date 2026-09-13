import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { ReviewDto } from '@/types/review';
import { CheckCircle, Trash2 } from 'lucide-react';

interface ReviewModerationActionsProps {
  review: ReviewDto;
  onApprove: () => void;
  onDelete: () => void;
  isApproving: boolean;
  isDeleting: boolean;
}

export function ReviewModerationActions({
  review,
  onApprove,
  onDelete,
  isApproving,
  isDeleting,
}: ReviewModerationActionsProps): React.JSX.Element {
  return (
    <div className="flex space-x-2">
      {review.status === 'PENDING' && (
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          disabled={isApproving || isDeleting}
          className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
          data-testid="approve-review-button"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isApproving ? 'Approving...' : 'Approve'}
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={isApproving || isDeleting}
        className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        data-testid="delete-review-button"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}