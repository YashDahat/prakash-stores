import EventCard from '@/components/event/EventCard';
import type { EventDto } from '@/types/event';

interface EventListProps {
  events: EventDto[];
}

export default function EventList({ events }: EventListProps): React.JSX.Element {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}