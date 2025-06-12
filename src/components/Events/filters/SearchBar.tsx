import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConfig } from '@/contexts/ConfigContext';

interface SearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

export const SearchBar = ({ search, onSearchChange, onToggleFilters, activeFilterCount }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState(search);
  const { config } = useConfig();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder={config.searchPlaceholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pl-10 pr-20 h-12 text-base bg-white border-gray-200 focus:ring-orange-500 focus:border-orange-500"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleFilters}
          className="text-gray-500 hover:text-orange-600"
        >
          <Filter className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">{config.filtersButtonText}</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
    </form>
  );
};
