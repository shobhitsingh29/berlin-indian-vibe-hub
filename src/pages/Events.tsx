import { Event, EventFilters as EventFiltersType } from '@/types/event';
import { EventsService } from '@/services/api/events';
import { SearchService } from '@/services/api/search';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import EventCard from '@/components/Events/EventCard';
import EventFilters from '@/components/Events/EventFilters';
import { useAuth } from '@/contexts/AuthContext';

const eventsService = EventsService.getInstance();
const searchService = SearchService.getInstance();

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(12);
  const [searchConfig, setSearchConfig] = useState<{ fields: string[], sortOptions: string[] } | null>(null);
  const { user } = useAuth();
  const { config, getConfigValue } = useConfig();
  const loadingSkeletonCount = getConfigValue('loadingSkeletonCount') ?? 6;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch search configuration first
    searchService.getSearchFilters().then(config => {
      setSearchConfig(config);
      // Only fetch events after getting search config
      fetchEvents();
    }).catch(error => {
      console.error('Error fetching search config:', error);
      setError('Failed to load search configuration');
    });
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all events initially
      const response = await searchService.searchEvents({
        page: currentPage,
        limit: itemsPerPage
      });
      setEvents(response.data);
      setFilteredEvents(response.data);
      setTotalResults(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Error fetching events:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters: EventFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsLoading(true);
    try {
      const searchParams = { ...newFilters, page: currentPage, limit: itemsPerPage };
      const response = await searchService.searchEvents(searchParams);
      setFilteredEvents(response.data);
      setTotalResults(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const searchParams = { ...filters, page: newPage, limit: itemsPerPage };
      searchService.searchEvents(searchParams).then(response => {
        setFilteredEvents(response.data);
        setTotalResults(response.meta.total);
        setTotalPages(response.meta.totalPages);
      }).catch(error => {
        setError('Failed to fetch events');
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {user && (
            <Button
              variant="outline"
              onClick={() => navigate('/events/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          )}
        </div>

        <EventFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchConfig={searchConfig}
          resultsCount={totalResults}
        />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(loadingSkeletonCount)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your criteria</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              onClick={() => {
                setError(null);
                fetchEvents();
              }}
              className="mt-4"
            >
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
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Events;

  useEffect(() => {
    searchService.getSearchFilters().then(config => {
      setSearchConfig(config);
      fetchEvents();
    }).catch(error => {
      console.error('Error fetching search config:', error);
      setError('Failed to load search configuration');
    });
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await searchService.searchEvents({
        page: currentPage,
        limit: itemsPerPage
      });
      setEvents(response.data);
      setFilteredEvents(response.data);
      setTotalResults(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters: EventFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsLoading(true);
    try {
      const searchParams = { ...newFilters, page: currentPage, limit: itemsPerPage };
      const response = await searchService.searchEvents(searchParams);
      setFilteredEvents(response.data);
      setTotalResults(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const searchParams = { ...filters, page: newPage, limit: itemsPerPage };
      searchService.searchEvents(searchParams).then(response => {
        setFilteredEvents(response.data);
        setTotalResults(response.meta.total);
        setTotalPages(response.meta.totalPages);
      }).catch(error => {
        setError('Failed to fetch events');
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {user && (
            <Button
              variant="outline"
              onClick={() => navigate('/events/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          )}
        </div>

        <EventFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchConfig={searchConfig}
        />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(loadingSkeletonCount)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your criteria</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              onClick={() => {
                setError(null);
                fetchEvents();
              }}
              className="mt-4"
            >
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
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
              }}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}
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