import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { AdminDataGrid } from '@/components/admin/AdminDataGrid';
import type { RowAction } from '@/components/admin/RowActionsCell';
import { ReviewDto, ReviewStatus } from '@/types/review';
import { Badge } from '@/components/ui/badge';

interface ReviewTableProps {
  reviews: ReviewDto[];
  onApprove: (review: ReviewDto) => void;
  onReject: (review: ReviewDto) => void;
  onDelete: (review: ReviewDto) => void;
}

const StatusCell = (p: CustomCellRendererProps<ReviewDto>): React.JSX.Element | null => {
  if (!p.data) return null;
  const status = p.data.status;
  const cls =
    status === ReviewStatus.APPROVED ? 'bg-green-500'
      : status === ReviewStatus.PENDING ? 'bg-yellow-500'
        : 'bg-red-500';
  return <Badge className={cls}>{status}</Badge>;
};

export function ReviewTable({ reviews, onApprove, onReject, onDelete }: ReviewTableProps): React.JSX.Element {
  const columnDefs: ColDef<ReviewDto>[] = [
    { headerName: 'ID', field: 'id', width: 80, flex: 0 },
    { headerName: 'Product ID', field: 'productId', width: 120, flex: 0 },
    { headerName: 'User ID', field: 'userId', width: 110, flex: 0 },
    { headerName: 'Rating', field: 'rating', width: 100, flex: 0 },
    { headerName: 'Comment', field: 'comment', flex: 2, tooltipField: 'comment' },
    {
      headerName: 'Date',
      field: 'reviewDate',
      valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleDateString() : ''),
    },
    { headerName: 'Status', field: 'status', cellRenderer: StatusCell, width: 130, flex: 0 },
  ];

  const isNotPending = (r: ReviewDto) => r.status !== ReviewStatus.PENDING;
  const actions: RowAction<ReviewDto>[] = [
    { label: 'Approve', onClick: onApprove, hidden: isNotPending },
    { label: 'Reject', onClick: onReject, hidden: isNotPending },
    { label: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <AdminDataGrid
      testId="review-table"
      rowData={reviews}
      columnDefs={columnDefs}
      actions={actions}
      emptyMessage="No reviews found."
    />
  );
}
