
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/contexts/ConfigContext';
import Header from '@/components/Layout/Header';
import EventCard from '@/components/Events/EventCard';
import EventFilters from '@/components/Events/EventFilters';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Event, EventFilters as EventFiltersType } from '@/types/event';
import { EventsService } from '@/services/api/events';

const eventsService = EventsService.getInstance();

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedEvents = await eventsService.fetchEvents();
      setEvents(fetchedEvents);
      setFilteredEvents(fetchedEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Error fetching events:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
    const filtered = events.filter(event => {
      const matchesSearch = !newFilters.search || 
        event.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        event.category.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(newFilters.location.toLowerCase());

      const matchesCategory = !newFilters.category || 
        event.category.toLowerCase() === newFilters.category.toLowerCase();

      const matchesLocation = !newFilters.location || 
        event.location.toLowerCase().includes(newFilters.location.toLowerCase());

      const matchesDateRange = !newFilters.dateRange || 
        (new Date(event.dateTime) >= new Date(newFilters.dateRange.start) &&
         new Date(event.dateTime) <= new Date(newFilters.dateRange.end));

      return matchesSearch && matchesCategory && matchesLocation && matchesDateRange;
    });
    setFilteredEvents(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-orange-600">Events</h1>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                This Week
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                Near Me
              </Button>
            </div>
          </div>

          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(config.loadingSkeletonCount)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-orange-600">Events</h1>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                This Week
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" />
                Near Me
              </Button>
            </div>
          </div>

          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetchEvents();
              }}
              className="mt-4"
            >
              {config.retryButtonText}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-orange-600">Events</h1>
          <div className="flex gap-4">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              This Week
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Near Me
            </Button>
            {user?.role === 'event_creator' && (
              <Button
                onClick={() => navigate('/create-event')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            )}
          </div>
        </div>

        <EventFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
          resultsCount={filteredEvents.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.eventId}
              event={event}
              onStar={async (eventId) => {
                try {
                  await eventsService.starEvent(eventId);
                  setEvents(prev => prev.map(e => e.eventId === eventId ? { ...e, isStarred: !e.isStarred } : e));
                  setFilteredEvents(prev => prev.map(e => e.eventId === eventId ? { ...e, isStarred: !e.isStarred } : e));
                } catch (err) {
                  console.error('Error starring event:', err);
                }
              }}
              compact={config.compactEventCards}
            />
          ))}
        </div>

        {/* Load More */}
        {filteredEvents.length > 0 && filteredEvents.length >= 6 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => {
                // Implement load more functionality
                console.log('Load more events clicked');
              }}
            >
              Load More Events
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;