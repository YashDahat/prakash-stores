import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { AdminDataGrid } from '@/components/admin/AdminDataGrid';
import type { RowAction } from '@/components/admin/RowActionsCell';
import type { EventDto } from '@/types/event';

interface EventTableProps {
  events: EventDto[];
  onEdit: (event: EventDto) => void;
  onDelete: (event: EventDto) => void;
}

const ImageCell = (p: CustomCellRendererProps<EventDto>): React.JSX.Element => (
  <img src={p.data?.imageUrl} alt={p.data?.name} className="h-10 w-10 rounded-md object-cover" />
);

export function EventTable({ events, onEdit, onDelete }: EventTableProps): React.JSX.Element {
  const columnDefs: ColDef<EventDto>[] = [
    { headerName: 'Image', field: 'imageUrl', cellRenderer: ImageCell, sortable: false, filter: false, width: 90, flex: 0 },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Time', field: 'time' },
    { headerName: 'Location', field: 'location' },
  ];

  const actions: RowAction<EventDto>[] = [
    { label: 'Edit', onClick: onEdit },
    { label: 'Delete', onClick: onDelete, danger: true },
  ];

  return (
    <AdminDataGrid
      testId="event-table"
      rowData={events}
      columnDefs={columnDefs}
      actions={actions}
      rowHeight={56}
      emptyMessage="No events found."
    />
  );
}
