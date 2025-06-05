'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, MoreHorizontal } from 'lucide-react';
import { Job } from '@/types/Job';

interface JobListTableProps {
  jobs: Job[];
  onViewDetails: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
  onViewApplicants: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
}

export default function JobListTable({
  jobs,
  onViewDetails,
  onEditJob,
  onViewApplicants,
  onDeleteJob,
}: JobListTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    return status === 'OPEN' ? 'default' : 'destructive';
  };

  const getJobTypeBadgeVariant = (jobType: string) => {
    return jobType === 'FullTime' ? 'secondary' : 'outline';
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-6">
        <h2 className="text-lg font-medium text-gray-900">Job List</h2>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Posted Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Job Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Applicants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {job.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={getStatusBadgeVariant(job.status)}
                    className={
                      job.status === 'OPEN'
                        ? 'border-green-200 bg-white text-green-600 hover:bg-white'
                        : 'border-red-200 bg-white text-red-600 hover:bg-white'
                    }
                  >
                    {job.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={getJobTypeBadgeVariant(job.typeOfEmployment)}
                    className={
                      job.typeOfEmployment === 'FullTime'
                        ? 'border-purple-200 bg-white text-purple-600 hover:bg-white'
                        : 'border-orange-200 bg-white text-orange-600 hover:bg-white'
                    }
                  >
                    {job.typeOfEmployment}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                  {job.applicants || 0}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => job.id && onViewDetails(job.id)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => job.id && onEditJob(job.id)}
                      >
                        Edit Job
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => job.id && onViewApplicants(job.id)}
                      >
                        View Applicants
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => job.id && onDeleteJob(job.id)}
                        className="text-red-600"
                      >
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
