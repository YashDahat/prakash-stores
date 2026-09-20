import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  colorSchemeDark,
  type ColDef,
} from 'ag-grid-community';
import { RowActionsCell, type RowAction } from './RowActionsCell';

// Register all Community features once (v33+ requires explicit module registration).
ModuleRegistry.registerModules([AllCommunityModule]);

// Dark theme to match the admin layout (which renders inside a `dark` container).
const adminGridTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  backgroundColor: '#0b0b0c',
  headerBackgroundColor: '#151518',
  borderColor: 'rgba(255,255,255,0.08)',
  fontFamily: 'inherit',
});

interface AdminDataGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  /** Row actions collapsed into a single kebab (⋮) menu, pinned to the right. */
  actions?: RowAction<T>[];
  rowHeight?: number;
  pagination?: boolean;
  pageSize?: number;
  /** Message shown when there is no data. */
  emptyMessage?: string;
  testId?: string;
}

export function AdminDataGrid<T>({
  rowData,
  columnDefs,
  actions,
  rowHeight,
  pagination = true,
  pageSize = 10,
  emptyMessage = 'No records found.',
  testId,
}: AdminDataGridProps<T>): React.JSX.Element {
  const cols = useMemo<ColDef<T>[]>(() => {
    const defs = [...columnDefs];
    if (actions && actions.length > 0) {
      defs.push({
        headerName: '',
        colId: 'actions',
        pinned: 'right',
        width: 64,
        maxWidth: 64,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: RowActionsCell,
        cellRendererParams: { actions },
        cellStyle: { overflow: 'visible' },
      });
    }
    return defs;
  }, [columnDefs, actions]);

  const defaultColDef = useMemo<ColDef>(
    () => ({ sortable: true, resizable: true, filter: false, flex: 1, minWidth: 100 }),
    [],
  );

  return (
    <div style={{ width: '100%' }} data-testid={testId}>
      <AgGridReact<T>
        theme={adminGridTheme}
        rowData={rowData}
        columnDefs={cols}
        defaultColDef={defaultColDef}
        rowHeight={rowHeight}
        domLayout="autoHeight"
        pagination={pagination}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 50]}
        overlayNoRowsTemplate={emptyMessage}
        animateRows
      />
    </div>
  );
}
