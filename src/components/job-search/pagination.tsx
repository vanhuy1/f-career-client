import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Add current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 2 && currentPage > 3) {
        pages.push('...');
      } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
        pages.push('...');
      } else {
        pages.push(i);
      }
    }

    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-10 w-10 items-center justify-center text-gray-500"
          >
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={page === currentPage ? 'default' : 'outline'}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-md ${
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'border text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
