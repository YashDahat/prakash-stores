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
      {/* Hero Section — offer badge on black; the image's own black backdrop blends with bg-black */}
      <section className="relative h-[500px] md:h-[600px] bg-contain bg-no-repeat bg-center bg-black flex items-end justify-center" style={{ backgroundImage: 'url(/Prakash_Store_offer_logo.png)' }}>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </section>

      {/* Events Grid Section */}
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-screen-2xl mx-auto">
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