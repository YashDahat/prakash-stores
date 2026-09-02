import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { EventDto } from '@/types/event';

interface EventFormProps {
  initialData: EventDto | null;
  onSubmit: (data: EventDto) => void;
  onCancel: () => void;
}

const eventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().min(1, 'Description is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().min(1, 'Event time is required'),
  imageUrl: z.string().url('Invalid URL').min(1, 'Image URL is required'),
});

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps): React.JSX.Element {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      eventDate: initialData?.eventDate ?? '',
      eventTime: initialData?.eventTime ?? '',
      imageUrl: initialData?.imageUrl ?? '',
    },
  });

  const handleSubmit = (values: z.infer<typeof eventFormSchema>): void => {
    onSubmit({
      id: initialData?.id ?? 0, // ID is ignored for creation, but required by EventDto
      name: values.name,
      description: values.description,
      eventDate: values.eventDate,
      eventTime: values.eventTime,
      imageUrl: values.imageUrl,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Summer Sale Event" {...field} data-testid="event-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the event" {...field} data-testid="event-description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} data-testid="event-date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} data-testid="event-time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/event-image.jpg" {...field} data-testid="event-image-url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="event-form-cancel">
            Cancel
          </Button>
          <Button type="submit" className="bg-[#E87A00] hover:bg-[#D46A00] text-white" data-testid="event-form-submit">
            {initialData ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
}