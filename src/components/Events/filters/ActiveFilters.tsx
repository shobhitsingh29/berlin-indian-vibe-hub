import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useConfig } from '@/contexts/ConfigContext';

interface ActiveFiltersProps {
  filters: any;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  config: any;
}

export const ActiveFilters = ({ filters, onClearFilter, onClearAll }: ActiveFiltersProps) => {
  const { config } = useConfig();
  const hasActiveFilters = filters.search || filters.category || filters.location || filters.dateRange;

  if (!hasActiveFilters) return null;

  const renderBadge = (key: string, label: string, value: any) => {
    if (!value) return null;

    const formattedValue = key === 'search' ? `"${value}"` :
      key === 'dateRange' ? `From ${format(new Date(value.start), config.dateFormat)} to ${format(new Date(value.end), config.dateFormat)}` :
      value;

    return (
      <Badge key={key} variant="secondary" className="bg-orange-100 text-orange-700">
        {label}: {formattedValue}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClearFilter(key)}
          className="ml-2 h-6 px-2 text-xs text-orange-600 hover:text-orange-700"
        >
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {renderBadge('search', config.searchBadgeText, filters.search)}
      {renderBadge('category', config.categoryBadgeText, filters.category)}
      {renderBadge('location', config.locationBadgeText, filters.location)}
      {renderBadge('dateRange', config.dateRangeBadgeText, filters.dateRange)}
    </div>
  );
};

export default ActiveFilters;
