import type { ColDef } from 'ag-grid-community';
import { AdminDataGrid } from '@/components/admin/AdminDataGrid';
import type { RowAction } from '@/components/admin/RowActionsCell';
import type { Brand } from '@/types/brand';

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export function BrandTable({ brands, onEdit, onDelete }: BrandTableProps): React.JSX.Element {
  const columnDefs: ColDef<Brand>[] = [
    { headerName: 'ID', field: 'id', width: 100, flex: 0 },
    { headerName: 'Name', field: 'name' },
  ];

  const actions: RowAction<Brand>[] = [
    { label: 'Edit', onClick: onEdit },
    { label: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <AdminDataGrid
      testId="brand-table"
      rowData={brands}
      columnDefs={columnDefs}
      actions={actions}
      emptyMessage="No brands found."
    />
  );
}
