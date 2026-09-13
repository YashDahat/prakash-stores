import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StoreEventDto } from '@/types/storeEvent';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';

interface EventTableProps {
  events: StoreEventDto[];
  onEdit: (event: StoreEventDto) => void;
  onDelete: (event: StoreEventDto) => void;
  isLoading: boolean;
  error: Error | null;
}

export function EventTable({ events, onEdit, onDelete, isLoading, error }: EventTableProps): React.JSX.Element {
  if (isLoading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
  }

  if (!events || events.length === 0) {
    return <div className="text-center py-8 text-gray-500">No events found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table data-testid="event-table">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} data-testid={`event-row-${event.id}`}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{format(new Date(event.eventDate), 'PPP')}</TableCell>
              <TableCell>{`${event.startTime} - ${event.endTime}`}</TableCell>
              <TableCell>
                <a href={event.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[#E87A00] hover:underline">
                  View Image
                </a>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(event)}
                  className="mr-2 hover:bg-gray-100 transition-all duration-200"
                  data-testid={`edit-event-${event.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(event)}
                  className="hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                  data-testid={`delete-event-${event.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}