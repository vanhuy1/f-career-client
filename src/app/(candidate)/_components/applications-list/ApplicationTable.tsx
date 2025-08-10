'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import type { Application } from '@/types/Application';
import { useRouter } from 'next/navigation';
import { setSelectedApplication } from '@/services/state/applicationsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/app/(candidate)/_components/applications-list/StatusBadge';
import { ApplicationStatus } from '@/enums/applicationStatus';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '../../../../utils/helpers';

interface ApplicationTableProps {
  applications: Application[] | null;
  loading: boolean;
  error: string | null;
}

export default function ApplicationTable({
  applications,
  loading,
  error,
}: ApplicationTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleRowClick = (application: Application) => {
    dispatch(setSelectedApplication(application));
    router.push(`/ca/application-list/${application.id}`);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Sorting logic
  const sortedApplications = applications
    ? [...applications].sort((a, b) => {
        if (!sortConfig) return 0;
        let aValue, bValue;
        switch (sortConfig.key) {
          case 'company':
            aValue = a.company?.companyName?.toLowerCase() || '';
            bValue = b.company?.companyName?.toLowerCase() || '';
            break;
          case 'role':
            aValue = a.job?.title?.toLowerCase() || '';
            bValue = b.job?.title?.toLowerCase() || '';
            break;
          case 'status':
            aValue = a.status?.toLowerCase() || '';
            bValue = b.status?.toLowerCase() || '';
            break;
          case 'date':
            aValue = a.applied_at || '';
            bValue = b.applied_at || '';
            break;
          default:
            return 0;
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [];

  const filteredApplications =
    sortedApplications.filter(
      (application) =>
        application.company?.companyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        application.job?.title.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search Applications"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800">
              <TableHead
                className="cursor-pointer px-6 py-4 font-medium text-white select-none"
                onClick={() => handleSort('company')}
              >
                Company Name
                {sortConfig?.key === 'company' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer px-6 py-4 font-medium text-white select-none"
                onClick={() => handleSort('role')}
              >
                Roles
                {sortConfig?.key === 'role' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer px-6 py-4 font-medium text-white select-none"
                onClick={() => handleSort('date')}
              >
                Date Applied
                {sortConfig?.key === 'date' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer px-6 py-4 font-medium text-white select-none"
                onClick={() => handleSort('status')}
              >
                Status
                {sortConfig?.key === 'status' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="px-6 py-4 font-medium text-white select-none">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((application) => (
              <TableRow
                key={application.id}
                className="cursor-pointer transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                onClick={() => handleRowClick(application)}
              >
                <TableCell className="px-6 py-4 font-medium text-gray-700">
                  {application.company?.companyName}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  {application.job?.title}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  {formatDate(application.applied_at)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <StatusBadge
                    status={application.status as ApplicationStatus}
                  />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMoreClick}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Withdraw
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="h-8 w-8"
              >
                {pageNum}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
