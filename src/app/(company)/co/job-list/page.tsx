'use client';

import { useState, useEffect } from 'react';
import { jobService } from '@/services/api/jobs/job-api';
import { companyService } from '@/services/api/company/company-api';
import { toast } from 'react-toastify';
import { useUser } from '@/services/state/userSlice';
import { JobByCompanyId } from '@/types/Job';

// Components
import JobListTable from './_components/job-list-table';
import JobListPagination from './_components/job-list-pagination';
import { useRouter } from 'next/navigation';

export default function JobListingDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [jobs, setJobs] = useState<JobByCompanyId[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [company, setCompany] = useState<{ companyName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useUser();
  const companyId = user?.data?.companyId;
  const router = useRouter();

  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;

      try {
        setIsLoading(true);
        const data = await companyService.findOne(companyId);
        setCompany(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to load company data';
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  // Fetch jobs using getJobsByCompanyId with pagination
  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId) return;

      try {
        setIsLoading(true);
        // Pass currentPage and itemsPerPage - the function now handles offset calculation internally
        const response = await jobService.getJobsByCompanyId(
          companyId,
          currentPage,
          itemsPerPage,
        );

        // Check if the response has the expected structure
        if (response && response.data) {
          setJobs(response.data);
          setTotalItems(response.meta?.count);
        } else {
          // If response structure is not as expected, handle it
          console.log('Empty or invalid response from jobs API:', response);
          setJobs([]);
          setTotalItems(0);
        }
        setIsLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load jobs';
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    if (company) {
      fetchJobs();
    }
  }, [companyId, company, currentPage, itemsPerPage]);

  // Handle page or items per page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Event handlers for job actions
  const handleViewDetails = (jobId: string) => {
    const job = jobs.find((job) => job.jobId === jobId);
    if (!job) return;

    router.push(`/co/job-list/${jobId}/job-details`);
  };

  const handleEditJob = (jobId: string) => {
    const job = jobs.find((job) => job.jobId === jobId);
    if (!job) return;

    toast.info(`Edit job: ${job.jobTitle}`);
  };

  const handleViewApplicants = (jobId: string) => {
    const job = jobs.find((job) => job.jobId === jobId);
    if (!job) return;

    router.push(`/co/job-list/${jobId}/applicants`);
  };

  const handleDeleteJob = async (jobId: string) => {
    const job = jobs.find((job) => job.jobId === jobId);
    if (!job) {
      toast.error('Could not find job details');
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the job: ${job.jobTitle}?`,
      )
    ) {
      try {
        // Now we can use the real job ID for deletion
        await jobService.delete(jobId);
        toast.success('Job deleted successfully');

        // Refresh job list
        const response = await jobService.getJobsByCompanyId(
          companyId!,
          currentPage,
          itemsPerPage,
        );

        if (response && response.data) {
          setJobs(response.data);
          // Update total items count
          setTotalItems(response.meta.count);

          // If we've deleted the last item on a page, go back one page
          if (response.data.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete job';
        toast.error(`Failed to delete job: ${errorMessage}`);
      }
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="rounded-md bg-red-100 p-4">
            <p>No job open</p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="rounded-md bg-gray-100 p-4">
            <h3 className="text-lg font-medium text-gray-800">
              No Company Found
            </h3>
            <p className="text-sm text-gray-600">
              Could not find company information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidde max-h-screen">
      <div className="mx-auto max-w-7xl">
        <JobListTable
          totalItems={totalItems}
          jobs={jobs}
          onViewDetails={handleViewDetails}
          onEditJob={handleEditJob}
          onViewApplicants={handleViewApplicants}
          onDeleteJob={handleDeleteJob}
          companyName={company.companyName}
        />

        <JobListPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
