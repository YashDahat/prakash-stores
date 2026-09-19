import { useUpcomingEvents } from '@/hooks/eventHooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsPage() {
  const { data: events, isLoading, isError, error } = useUpcomingEvents();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/images/events-hero.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Upcoming Events & Workshops</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Join us for exciting in-store events, workshops, and community gatherings.
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-[#212121]">Our Calendar</h2>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                  <Skeleton className="w-full h-48 mb-4 rounded-md" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </Card>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center text-red-600 text-lg">
              <p>Error loading events: {error instanceof Error ? error.message : 'Something went wrong'}</p>
              <p>Please try again later.</p>
            </div>
          )}

          {!isLoading && !isError && (events?.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">
              <p>No upcoming events scheduled at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events?.map((event) => (
                <Card key={event.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="p-0 mb-4">
                    <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover rounded-md" />
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardTitle className="text-xl font-semibold mb-2 text-[#212121]">{event.name}</CardTitle>
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Date:</span> {formatDate(event.date)}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Time:</span> {formatTime(event.time)}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Location:</span> {event.location}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}