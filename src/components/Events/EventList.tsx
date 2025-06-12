import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  itemsPerPage: number;
  loadingSkeletonCount: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}

const EventList = ({
  events,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalResults,
  itemsPerPage,
  loadingSkeletonCount,
  onRetry,
  onPageChange,
}: EventListProps) => {
  return (
    <div>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(loadingSkeletonCount)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found matching your criteria</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button variant="outline" onClick={onRetry} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages} ({totalResults} results)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
