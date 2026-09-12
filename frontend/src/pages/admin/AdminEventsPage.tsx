import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useAdminGetAllEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '@/hooks/storeEventHooks';
import { StoreEventDto } from '@/types/storeEvent';
import { EventTable } from '@/components/admin/event/EventTable';
import EventForm from '@/components/admin/event/EventForm';
import { DeleteEventDialog } from '@/components/admin/event/DeleteEventDialog';
import { toast } from 'sonner';

export default function AdminEventsPage() {
  const { data: events, isLoading, isError, error } = useAdminGetAllEvents();
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const [editingEvent, setEditingEvent] = useState<StoreEventDto | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<StoreEventDto | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleCreateNew = (): void => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event: StoreEventDto): void => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = (event: StoreEventDto): void => {
    setDeletingEvent(event);
  };

  const handleFormSubmit = (data: Partial<StoreEventDto>): void => {
    if (editingEvent) {
      updateEvent(
        { id: editingEvent.id, request: data as StoreEventDto },
        {
          onSuccess: () => {
            toast.success('Event updated successfully!');
            setIsFormOpen(false);
            setEditingEvent(null);
          },
          onError: (err) => {
            toast.error(`Failed to update event: ${err.message}`);
          },
        }
      );
    } else {
      createEvent(data as StoreEventDto, {
        onSuccess: () => {
          toast.success('Event created successfully!');
          setIsFormOpen(false);
        },
        onError: (err) => {
          toast.error(`Failed to create event: ${err.message}`);
        },
      });
    }
  };

  const handleFormCancel = (): void => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleConfirmDelete = (): void => {
    if (deletingEvent) {
      deleteEvent(deletingEvent.id, {
        onSuccess: () => {
          toast.success('Event deleted successfully!');
          setDeletingEvent(null);
        },
        onError: (err) => {
          toast.error(`Failed to delete event: ${err.message}`);
        },
      });
    }
  };

  const handleCloseDeleteDialog = (): void => {
    setDeletingEvent(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#212121]">Manage Events</h1>
        <Button onClick={handleCreateNew} className="bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold">
          Add New Event
        </Button>
      </div>

      <EventTable
        events={events || []}
        isLoading={isLoading}
        error={isError ? error : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {(isFormOpen || editingEvent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-semibold mb-4">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <EventForm
              initialData={editingEvent}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isCreating || isUpdating}
            />
          </div>
        </div>
      )}

      <DeleteEventDialog
        event={deletingEvent}
        isOpen={!!deletingEvent}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}