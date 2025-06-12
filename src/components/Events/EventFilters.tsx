
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { EVENT_CATEGORIES, BERLIN_ZONES, EventFilters as EventFiltersType } from '@/types';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
  resultsCount?: number;
}

const EventFilters = ({ filters, onFiltersChange, resultsCount }: EventFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput });
  };

  const updateFilter = (key: keyof EventFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.category || filters.location || filters.dateRange;
  const activeFilterCount = [filters.search, filters.category, filters.location, filters.dateRange].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search by name, artist, or vibe..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-20 h-12 text-base bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-orange-600"
          >
            <Filter className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </form>

      {/* Results Count */}
      {resultsCount !== undefined && (
        <div className="text-sm text-gray-600">
          {resultsCount} event{resultsCount !== 1 ? 's' : ''} found
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-2 h-6 px-2 text-xs text-orange-600 hover:text-orange-700"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              Search: "{filters.search}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput('');
                  updateFilter('search', undefined);
                }}
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {filters.category}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('category', undefined)}
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {filters.location}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('location', undefined)}
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={filters.category || ''}
                  onValueChange={(value) => updateFilter('category', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Select
                  value={filters.location || ''}
                  onValueChange={(value) => updateFilter('location', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All locations</SelectItem>
                    {BERLIN_ZONES.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      start: e.target.value
                    })}
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      end: e.target.value
                    })}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear All
              </Button>
              <Button onClick={() => setIsExpanded(false)} size="sm">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventFilters;
