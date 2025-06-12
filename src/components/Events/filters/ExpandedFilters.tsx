import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface ExpandedFiltersProps {
  filters: any;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onDateRangeChange: (type: 'start' | 'end', value: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  config: any;
}

const ExpandedFilters = ({ filters, onCategoryChange, onLocationChange, onDateRangeChange, onClearAll, onClose, config }: ExpandedFiltersProps) => {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">{config.categoryLabel}</label>
              <Select
                value={filters.category}
                onValueChange={(value) => onCategoryChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {config.categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{config.locationLabel}</label>
              <Input
                type="text"
                value={filters.location}
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="Enter location"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium">{config.dateRangeLabel}</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">From</label>
                  <Input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => onDateRangeChange('start', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">To</label>
                  <Input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => onDateRangeChange('end', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClearAll}
            >
              {config.clearFiltersButtonText}
            </Button>
            <Button
              onClick={onClose}
            >
              {config.applyFiltersButtonText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpandedFilters;
