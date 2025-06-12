import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import Header from '@/components/Layout/Header';
import EventFilters from '@/components/Events/EventFilters';
import EventList from '@/components/Events/EventList';
import { SearchService } from '@/services/api/search';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/contexts/ConfigContext';
import { Button } from '@/components/ui/button';
import { Event, EventFilters as EventFiltersType } from '@/types/event';

// Keep an instance of the search service (singleton)
const searchService = SearchService.getInstance();

interface SearchMeta {
  total: number;
  totalPages: number;
  page: number;
}

const ITEMS_PER_PAGE = 12;

const Events = () => {
  /* --------------------------------------------------
   * Context & Hooks
   * -------------------------------------------------- */
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getConfigValue } = useConfig();

  /* --------------------------------------------------
   * State
   * -------------------------------------------------- */
  const [searchConfig, setSearchConfig] = useState<{
    fields: string[];
    sortOptions: string[];
  } | null>(null);

  const [filters, setFilters] = useState<EventFiltersType>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [meta, setMeta] = useState<SearchMeta>({ total: 0, totalPages: 1, page: 1 });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------------------------
   * Helpers
   * -------------------------------------------------- */
  const fetchEvents = async (activeFilters: EventFiltersType = filters, page = meta.page) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await searchService.searchEvents({
        ...activeFilters,
        page,
        limit: ITEMS_PER_PAGE,
      });

      setEvents(response.data);
      setMeta({ total: response.meta.total, totalPages: response.meta.totalPages, page });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* --------------------------------------------------
   * Effects
   * -------------------------------------------------- */
  // Initial load – get search config then first page of events
  useEffect(() => {
    const init = async () => {
      try {
        const cfg = await searchService.getSearchFilters();
        setSearchConfig(cfg);
      } finally {
        // Always fetch events even if config failed; UI can handle missing config
        fetchEvents({}, 1);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when filters or page change
  useEffect(() => {
    if (!isLoading) fetchEvents(filters, meta.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, meta.page]);

  /* --------------------------------------------------
   * Callbacks
   * -------------------------------------------------- */
  const handleFiltersChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
    setMeta((m) => ({ ...m, page: 1 })); // reset to first page
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== meta.page && newPage >= 1 && newPage <= meta.totalPages) {
      setMeta((m) => ({ ...m, page: newPage }));
    }
  };

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
  const loadingSkeletonCount = getConfigValue('loadingSkeletonCount') ?? 6;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {user && (
            <Button variant="outline" onClick={() => navigate('/events/create')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          )}
        </div>

        {/* Filters */}
        <EventFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchConfig={searchConfig}
          resultsCount={meta.total}
        />

        {/* Event List */}
        <EventList
          events={events}
          isLoading={isLoading}
          error={error}
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalResults={meta.total}
          itemsPerPage={ITEMS_PER_PAGE}
          loadingSkeletonCount={loadingSkeletonCount}
          onRetry={() => fetchEvents(filters, meta.page)}
          onPageChange={handlePageChange}
        />
      </section>
    </main>
  );
};

export default Events;