import { EventFilters as EventFiltersType } from '@/types/event';
import { SearchService } from '@/services/api/search';
import { useState } from 'react';

interface EventSearchProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

const searchService = SearchService.getInstance();

const EventSearch = ({ filters, onFiltersChange }: EventSearchProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchConfig, setSearchConfig] = useState<{ fields: string[], sortOptions: string[] } | null>(null);

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
        page: 1,
        limit: 12
      });
      onFiltersChange(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Error fetching events:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = async (newFilters: EventFiltersType) => {
    onFiltersChange(newFilters);
    setIsLoading(true);
    try {
      const response = await searchService.searchEvents(newFilters);
      onFiltersChange(response.data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    searchConfig,
    handleFiltersChange
  };
};

export default EventSearch;
