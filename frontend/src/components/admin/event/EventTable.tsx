import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EventDto } from '@/types/event';
import { PencilIcon, Trash2Icon } from 'lucide-react';

interface EventTableProps {
  events: EventDto[];
  onEdit: (event: EventDto) => void;
  onDelete: (event: EventDto) => void;
}

export function EventTable({ events, onEdit, onDelete }: EventTableProps): React.JSX.Element {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No events found.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <TableCell>{event.id}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.eventDate}</TableCell>
                <TableCell>{event.eventTime}</TableCell>
                <TableCell className="max-w-[200px] truncate">{event.imageUrl}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(event)}
                    className="mr-2 hover:bg-gray-200 transition-all duration-200"
                    data-testid={`edit-event-${event.id}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(event)}
                    className="hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                    data-testid={`delete-event-${event.id}`}
                  >
                    <Trash2Icon className="h-4 w-4" />
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