import type { ColDef } from 'ag-grid-community';
import { AdminDataGrid } from '@/components/admin/AdminDataGrid';
import type { RowAction } from '@/components/admin/RowActionsCell';
import type { ProductCategory } from '@/types/product';

interface CategoryTableProps {
  categories: ProductCategory[];
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps): React.JSX.Element {
  const columnDefs: ColDef<ProductCategory>[] = [
    { headerName: 'ID', field: 'id', width: 100, flex: 0 },
    { headerName: 'Name', field: 'name' },
  ];

  const actions: RowAction<ProductCategory>[] = [
    { label: 'Edit', onClick: onEdit },
    { label: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <AdminDataGrid
      testId="category-table"
      rowData={categories}
      columnDefs={columnDefs}
      actions={actions}
      emptyMessage="No categories found."
    />
  );
}
