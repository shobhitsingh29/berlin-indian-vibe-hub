import React from 'react';
import { useState } from 'react';
import { useConfig } from '@/contexts/ConfigContext';
import { SearchBar } from './filters/SearchBar';
import { ActiveFilters } from './filters/ActiveFilters';
import ExpandedFilters from './filters/ExpandedFilters';
import LoadingSpinner from './filters/LoadingSpinner';
import ResultsCount from './filters/ResultsCount';
import type { EventFilters } from '@/types/event';

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  resultsCount: number;
}

const EventFilters = ({ filters, onFiltersChange, resultsCount }: EventFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const { config } = useConfig();

  const updateFilter = (key: keyof EventFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ search: '', category: '', location: '', dateRange: '' });
    setSearchInput('');
  };

  const hasActiveFilters = filters.search || filters.category || filters.location || filters.dateRange;

  if (!config) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <SearchBar
        search={searchInput}
        onSearchChange={(search) => {
          setSearchInput(search);
          updateFilter('search', search);
        }}
        onToggleFilters={() => setIsExpanded(!isExpanded)}
        activeFilterCount={hasActiveFilters ? 1 : 0}
      />

      {resultsCount !== undefined && (
        <ResultsCount
          resultsCount={resultsCount}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          config={config}
        />
      )}

      {hasActiveFilters && (
        <ActiveFilters
          filters={filters}
          onClearFilter={(key) => updateFilter(key, '')}
          onClearAll={clearFilters}
          config={config}
        />
      )}

      {isExpanded && (
        <ExpandedFilters
          filters={filters}
          onCategoryChange={(value) => updateFilter('category', value)}
            onLocationChange={(value) => updateFilter('location', value)}
        />
      )}
    </div>
  );
};

export default EventFilters;
