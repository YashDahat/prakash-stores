import { useUpcomingEvents } from '@/hooks/storeEventHooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsPage() {
  const { data: events, isLoading, isError, error } = useUpcomingEvents();

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Upcoming Events</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Error</h1>
          <p>Failed to load events: {error?.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#212121]">Upcoming Events</h1>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-[#1A3A6D]">{event.title}</CardTitle>
                  <p className="text-gray-600 text-sm">
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {' '}
                    at {event.startTime} - {event.endTime}
                  </p>
                </CardHeader>
                <CardContent>
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-[#212121] leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg">
            No upcoming events found. Please check back later!
          </div>
        )}
      </div>
    </section>
  );
}