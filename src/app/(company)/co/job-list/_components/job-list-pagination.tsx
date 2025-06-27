'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JobListPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export default function JobListPagination({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: JobListPaginationProps) {
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // If there are many pages, use ellipsis logic
    if (totalPages > 7) {
      // Current page is in first 3 pages
      if (currentPage <= 3) {
        pages.push(2, 3, 4, '...', totalPages);
      }
      // Current page is in last 3 pages
      else if (currentPage >= totalPages - 2) {
        pages.push(
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      }
      // Current page is in the middle
      else {
        pages.push(
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    } else {
      // Show all pages if there are 7 or fewer
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-between border-t bg-white px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">View</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">Jobs per page</span>
        <span className="ml-4 text-sm text-gray-600">
          {totalItems > 0
            ? `Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} jobs`
            : 'No jobs found'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
