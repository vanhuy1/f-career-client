'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { applicationService } from '@/services/api/applications/application-api';
import { Applicant } from '@/types/Applicants';
import { ApplicationStatus } from '@/enums/applicationStatus';
import StatusBadge from './StatusBadge';

// Utility to format date as "MMM dd, yyyy"
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function ApplicantTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(
    null,
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const router = useRouter();

  // Sorting logic
  const sortedApplicants = [...applicants].sort((a, b) => {
    if (!sortConfig) return 0;
    let aValue, bValue;
    switch (sortConfig.key) {
      case 'name':
        aValue = a.candidate.name.toLowerCase();
        bValue = b.candidate.name.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'job':
        aValue = a.job.title.toLowerCase();
        bValue = b.job.title.toLowerCase();
        break;
      default:
        return 0;
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredApplicants = sortedApplicants.filter(
    (applicant) =>
      (applicant.candidate.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        applicant.job.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter ? applicant.status === statusFilter : true),
  );

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplicants = filteredApplicants.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  // Helper to handle sort toggling
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Get count of applicants by status
  const getStatusCount = (status: ApplicationStatus) => {
    return applicants.filter((app) => app.status === status).length || 0;
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        const response = await applicationService.getApplicants();
        console.log('Fetched Applicants:', response);

        if (response && response.data) {
          setApplicants(response.data);
        } else {
          setApplicants([]);
        }
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setApplicants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Total Applicants: {filteredApplicants.length}
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search Applicants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
          {/* <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button> */}
          {/* <div className="flex rounded-lg bg-gray-100 p-1">
            <Button
              variant={viewMode === 'pipeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pipeline')}
              className="text-sm"
            >
              Pipeline View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="text-sm"
            >
              Table View
            </Button>
          </div> */}
        </div>
      </div>

      {/* Application Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {Object.values(ApplicationStatus).map((status) => (
          <div
            key={status}
            className={`cursor-pointer rounded-lg border ${
              status === statusFilter
                ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200'
                : 'bg-white'
            } p-4 shadow-sm transition-all hover:shadow-md`}
            onClick={() =>
              setStatusFilter(status === statusFilter ? null : status)
            }
          >
            <div className="mb-2 flex justify-between">
              <h3
                className={`font-medium ${status === statusFilter ? 'text-blue-700' : 'text-gray-700'}`}
              >
                {status === 'INTERVIEW'
                  ? 'Interviewing'
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </h3>
              <StatusBadge status={status} />
            </div>
            <p
              className={`text-2xl font-bold ${status === statusFilter ? 'text-blue-700' : ''}`}
            >
              {getStatusCount(status)}
            </p>
            <p
              className={`text-sm ${status === statusFilter ? 'text-blue-600' : 'text-gray-500'}`}
            >
              {status === 'APPLIED' && 'Applications awaiting review'}
              {status === 'INTERVIEW' && 'Ongoing interviews'}
              {status === 'HIRED' && 'Successful applications'}
              {status === 'REJECTED' && 'Unsuccessful applications'}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead
                className="cursor-pointer font-medium text-gray-600 select-none"
                onClick={() => handleSort('name')}
              >
                Full Name
                {sortConfig?.key === 'name' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-gray-600 select-none"
                onClick={() => handleSort('status')}
              >
                Hiring Stage
                {sortConfig?.key === 'status' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="font-medium text-gray-600">
                Applied Date
              </TableHead>
              <TableHead
                className="cursor-pointer font-medium text-gray-600 select-none"
                onClick={() => handleSort('job')}
              >
                Job Role
                {sortConfig?.key === 'job' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="font-medium text-gray-600">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  Loading applicants...
                </TableCell>
              </TableRow>
            ) : paginatedApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  No applicants found
                </TableCell>
              </TableRow>
            ) : (
              paginatedApplicants.map((applicant) => (
                <TableRow key={applicant.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            applicant.candidate.avatar_url || '/placeholder.svg'
                          }
                          alt={applicant.candidate.name}
                        />
                        <AvatarFallback>
                          {applicant.candidate.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {applicant.candidate.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={applicant.status} />
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(applicant.applied_at)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {applicant.job.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() =>
                          router.push(`applicant-list/${applicant.id}`)
                        }
                      >
                        View Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>
                            Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Applicants per page</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="h-8 w-8"
            >
              {page}
            </Button>
          ))}

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
    </div>
  );
}
