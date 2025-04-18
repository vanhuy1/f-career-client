import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];

    // Previous button
    pages.push(
      <Link
        key="prev"
        href="#"
        className="flex h-9 w-9 items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Link>,
    );

    // First page
    if (currentPage > 3) {
      pages.push(
        <Link
          key={1}
          href="#"
          className="flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 hover:bg-gray-50"
        >
          1
        </Link>,
      );

      // Ellipsis if needed
      if (currentPage > 4) {
        pages.push(
          <span
            key="ellipsis1"
            className="flex h-9 w-9 items-center justify-center"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>,
        );
      }
    }

    // Pages around current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(
        <Link
          key={i}
          href="#"
          className={`flex h-9 w-9 items-center justify-center rounded-md ${
            i === currentPage
              ? 'bg-indigo-600 text-white'
              : 'border text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </Link>,
      );
    }

    // Ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span
          key="ellipsis2"
          className="flex h-9 w-9 items-center justify-center"
        >
          <MoreHorizontal className="h-4 w-4" />
        </span>,
      );
    }

    // Last page
    if (currentPage < totalPages - 1) {
      pages.push(
        <Link
          key={totalPages}
          href="#"
          className="flex h-9 w-9 items-center justify-center rounded-md border text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </Link>,
      );
    }

    // Next button
    pages.push(
      <Link
        key="next"
        href="#"
        className="flex h-9 w-9 items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Link>,
    );

    return pages;
  };

  return <nav className="flex items-center gap-1">{renderPageNumbers()}</nav>;
}
