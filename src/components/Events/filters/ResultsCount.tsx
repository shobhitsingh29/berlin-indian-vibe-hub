import React from 'react';
import { Button } from '@/components/ui/button';

interface ResultsCountProps {
  resultsCount: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  config: any;
}

const ResultsCount = ({ resultsCount, hasActiveFilters, clearFilters, config }: ResultsCountProps) => {
  return (
    <div className="text-sm text-gray-600">
      {resultsCount} {config.eventLabel}{resultsCount !== 1 ? 's' : ''} found
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="ml-2 h-6 px-2 text-xs text-orange-600 hover:text-orange-700"
        >
          {config.clearFiltersButtonText}
        </Button>
      )}
    </div>
  );
};

export default ResultsCount;
