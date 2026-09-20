import type { JSX } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventTable } from '@/components/admin/events/EventTable';
import { EventForm } from '@/components/admin/events/EventForm';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/eventHooks';
import { useBulkUploadEvents } from '@/hooks/bulkUploadHooks';
import { ExcelUploadDialog } from '@/components/admin/ExcelUploadDialog';
import { EventDto } from '@/types/event';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

const AdminEventsPage = (): React.JSX.Element => {
  const { data: events, isLoading, isError, error } = useEvents();
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const bulkUploadEventsMutation = useBulkUploadEvents();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventDto | null>(null);

  const handleAddEvent = (): void => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: EventDto): void => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (event: EventDto): void => {
    setDeletingEvent(event);
  };

  const handleFormSubmit = (data: Omit<EventDto, 'id'>): void => {
    if (editingEvent) {
      updateEvent(
        { id: editingEvent.id, request: data as EventDto },
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
      createEvent(data as EventDto, {
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

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading events: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <div className="flex items-center gap-2">
          <ExcelUploadDialog
            title="Bulk upload events"
            columns={['name', 'date', 'time', 'description', 'location', 'imageUrl']}
            sampleRow={['Summer Sale', '2026-10-15', '10:00', 'Up to 50% off', 'Aundh, Pune', '']}
            templateName="events-template.csv"
            onUpload={(file) => bulkUploadEventsMutation.mutateAsync(file)}
          />
          <Button onClick={handleAddEvent} className="bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold">
            Add New Event
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <EventTable events={events || []} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
      )}

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

      <AlertDialog open={!!deletingEvent} onOpenChange={() => setDeletingEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event{' '}
              <span className="font-semibold">{deletingEvent?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEventsPage;