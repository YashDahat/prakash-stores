import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { AdminDataGrid } from '@/components/admin/AdminDataGrid';
import type { RowAction } from '@/components/admin/RowActionsCell';
import { ProductDto } from '@/types/product';

interface ProductTableProps {
  products: ProductDto[];
  page?: number;
  totalPages?: number;
  onEdit: (product: ProductDto) => void;
  onDelete: (product: ProductDto) => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (sort: string) => void;
}

const formatCurrency = (amount: number): string =>
  amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

const ImageCell = (p: CustomCellRendererProps<ProductDto>): React.JSX.Element => (
  <img src={p.data?.imageUrl} alt={p.data?.name} className="h-10 w-10 rounded-md object-cover" />
);

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps): React.JSX.Element {
  const columnDefs: ColDef<ProductDto>[] = [
    { headerName: 'Image', field: 'imageUrl', cellRenderer: ImageCell, sortable: false, width: 90, flex: 0 },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Category', field: 'categoryName' },
    { headerName: 'Brand', field: 'brandName' },
    { headerName: 'Price', field: 'price', valueFormatter: (p) => (p.value != null ? formatCurrency(p.value) : '') },
    { headerName: 'Stock', field: 'stock', width: 110, flex: 0 },
  ];

  const actions: RowAction<ProductDto>[] = [
    { label: 'Edit', onClick: onEdit },
    { label: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <AdminDataGrid
      testId="product-table"
      rowData={products}
      columnDefs={columnDefs}
      actions={actions}
      rowHeight={56}
      emptyMessage="No products found."
    />
  );
}
