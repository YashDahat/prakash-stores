import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/eventHooks';
import { EventTable } from '@/components/admin/event/EventTable';
import { EventForm } from '@/components/admin/event/EventForm';
import { DeleteConfirmationDialog } from '@/components/admin/shared/DeleteConfirmationDialog';
import { EventDto } from '@/types/event';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminEventsPage(): React.JSX.Element {
  const { data: events, isLoading, isError, error } = useEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<EventDto | null>(null);

  const handleAddEvent = (): void => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: EventDto): void => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (event: EventDto): void => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = (): void => {
    if (eventToDelete) {
      deleteEventMutation.mutate(eventToDelete.id, {
        onSuccess: () => {
          toast.success('Event deleted successfully!');
          setIsDeleteDialogOpen(false);
          setEventToDelete(null);
        },
        onError: (err) => {
          toast.error(`Failed to delete event: ${err.message}`);
        },
      });
    }
  };

  const handleFormSubmit = (data: EventDto): void => {
    if (editingEvent) {
      updateEventMutation.mutate(
        { eventId: editingEvent.id, request: data },
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
      createEventMutation.mutate(data, {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading events: {error?.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <Button onClick={handleAddEvent} data-testid="add-event-cta">
          Add New Event
        </Button>
      </div>

      <EventTable events={events || []} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={editingEvent}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteEvent}
        itemToDeleteName={eventToDelete?.name || 'event'}
      />
    </div>
  );
}