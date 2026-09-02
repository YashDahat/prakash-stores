import { useEvents } from '@/hooks/eventHooks';
import EventList from '@/components/event/EventList';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsPage() {
  const { data: events, isLoading, isError, error } = useEvents();

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">Upcoming Events</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <Skeleton className="h-48 w-full rounded-md mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          <h1 className="text-3xl font-semibold mb-4">Error loading events</h1>
          <p>{error?.message || 'Something went wrong.'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8">Upcoming Events</h1>
        {events && events.length > 0 ? (
          <EventList events={events} />
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No upcoming events found.</p>
          </div>
        )}
      </div>
    </section>
  );
}