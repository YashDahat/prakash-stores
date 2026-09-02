import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventDto } from '@/types/event';

export function EventCard({ event }: { event: EventDto }): React.JSX.Element {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
          <p className="text-sm">{new Date(event.eventDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} at {event.eventTime}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-gray-700 line-clamp-3">{event.description}</p>
      </CardContent>
    </Card>
  );
}