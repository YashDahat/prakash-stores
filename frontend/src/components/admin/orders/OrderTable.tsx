import type { ColDef } from 'ag-grid-community';
import { AdminDataGrid } from '@/components/admin/AdminDataGrid';
import type { RowAction } from '@/components/admin/RowActionsCell';
import { OrderDto } from '@/types/order';

interface OrderTableProps {
  orders: OrderDto[];
  onViewDetails: (order: OrderDto) => void;
}

export function OrderTable({ orders, onViewDetails }: OrderTableProps): React.JSX.Element {
  const columnDefs: ColDef<OrderDto>[] = [
    { headerName: 'Order ID', field: 'id', width: 120, flex: 0 },
    {
      headerName: 'Order Date',
      field: 'orderDate',
      valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleDateString() : ''),
    },
    {
      headerName: 'Total Amount',
      field: 'totalAmount',
      valueFormatter: (p) =>
        p.value != null ? p.value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '',
    },
    { headerName: 'Status', field: 'orderStatus' },
  ];

  const actions: RowAction<OrderDto>[] = [
    { label: 'View details', onClick: onViewDetails },
  ];

  return (
    <AdminDataGrid
      testId="order-table"
      rowData={orders}
      columnDefs={columnDefs}
      actions={actions}
      emptyMessage="No orders found."
    />
  );
}
