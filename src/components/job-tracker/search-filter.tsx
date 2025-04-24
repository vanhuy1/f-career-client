'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export function SearchFilter({ onSearch, onFilter }: SearchFilterProps) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
      <h2 className="mb-4 text-xl font-bold text-gray-800 md:mb-0">
        Applications History
      </h2>
      <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Search"
            className="w-full pl-10 sm:w-[200px]"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onFilter && onFilter()}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
}
