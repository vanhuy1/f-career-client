import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

/**
 * Pagination component specifically designed for notifications
 * Includes loading states and item count display
 */
export default function NotificationsPagination({
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
  totalItems = 0,
  itemsPerPage = 10,
}: NotificationsPaginationProps) {
  /**
   * Generate smart page numbers with ellipsis
   */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // In the middle
        pages.push(
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevPage = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  // Calculate current range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Don't render if no pages or invalid state
  if (totalPages <= 1 || currentPage > totalPages || currentPage < 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Items info */}
      <div className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} notifications
      </div>

      {/* Pagination controls */}
      <nav
        aria-label="Notifications pagination"
        className="flex items-center gap-1"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className="flex h-9 w-9 items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-gray-500"
            >
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={page === currentPage ? 'default' : 'outline'}
              onClick={() => handlePageClick(page)}
              disabled={isLoading}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm ${
                page === currentPage
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50`}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
          className="flex h-9 w-9 items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>

      {/* Quick navigation hint */}
      {totalPages > 5 && (
        <div className="text-xs text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
}
