'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { JobByCompanyId } from '@/types/Job';
import { formatDate } from '@/utils/helpers';

interface JobListTableProps {
  jobs: JobByCompanyId[];
  onViewDetails: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onViewApplicants: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  companyName: string;
  totalItems: number;
}

export default function JobListTable({
  jobs,
  onViewDetails,
  onEditJob,
  onViewApplicants,
  onDeleteJob,
  companyName,
  totalItems,
}: JobListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    return status === 'OPEN' ? 'default' : 'destructive';
  };

  const getJobTypeBadgeVariant = (jobType: string) => {
    return jobType === 'FullTime' ? 'secondary' : 'outline';
  };

  // Helper to handle sort toggling
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Apply sorting
  const sortedJobs = [...jobs].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue, bValue;
    switch (sortConfig.key) {
      case 'title':
        aValue = a.jobTitle.toLowerCase();
        bValue = b.jobTitle.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'date':
        aValue = a.postedDate ? new Date(a.postedDate).getTime() : 0;
        bValue = b.postedDate ? new Date(b.postedDate).getTime() : 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredJobs = sortedJobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Total Jobs: {totalItems}
          <p className="mt-1 text-sm text-gray-600">
            Managing jobs for {companyName}
          </p>
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search Jobs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800">
              <TableHead
                className="cursor-pointer px-6 py-4 font-medium text-white select-none"
                onClick={() => handleSort('title')}
              >
                Job Title
                {sortConfig?.key === 'title' &&
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
              <TableHead
                className="cursor-pointer px-6 py-4 font-medium text-white select-none"
                onClick={() => handleSort('date')}
              >
                Posted Date
                {sortConfig?.key === 'date' &&
                  (sortConfig.direction === 'asc' ? (
                    <ChevronUp className="ml-1 inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead className="px-6 py-4 font-medium text-white select-none">
                Due Date
              </TableHead>
              <TableHead className="px-6 py-4 font-medium text-white select-none">
                Job Type
              </TableHead>
              <TableHead className="px-6 py-4 font-medium text-white select-none">
                Applicants
              </TableHead>
              <TableHead className="px-6 py-4 font-medium text-white select-none">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow
                  key={job.jobId}
                  className="cursor-default transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  <TableCell className="px-6 py-4 font-medium text-gray-700">
                    {job.jobTitle}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={getStatusBadgeVariant(job.status)}
                      className={
                        job.status === 'Open'
                          ? 'border-green-200 bg-white text-green-600 hover:bg-white'
                          : 'border-red-200 bg-white text-red-600 hover:bg-white'
                      }
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600">
                    {formatDate(job.postedDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600">
                    {formatDate(job.endDate)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={getJobTypeBadgeVariant(job.jobType)}
                      className={
                        job.jobType === 'FullTime'
                          ? 'border-purple-200 bg-white text-purple-600 hover:bg-white'
                          : 'border-orange-200 bg-white text-orange-600 hover:bg-white'
                      }
                    >
                      {job.jobType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-gray-700">
                    {job.totalApplications || 0}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewDetails(job.jobId)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewApplicants(job.jobId)}
                          >
                            View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEditJob(job.jobId)}
                          >
                            Manage Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteJob(job.jobId)}
                            className="text-red-600"
                          >
                            Delete Job
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
    </div>
  );
}
