'use client';

import { useState, useEffect } from 'react';
import { jobService } from '@/services/api/jobs/job-api';
import { companyService } from '@/services/api/company/company-api';
import { toast } from 'react-toastify';
import { useUser } from '@/services/state/userSlice';
import { JobByCompanyId } from '@/types/Job';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2, Briefcase, Plus, FileText } from 'lucide-react';

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

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobByCompanyId | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useUser();
  const companyId = user?.data?.companyId;
  const router = useRouter();

  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;

      try {
        setIsLoading(true);
        const data = await companyService.findOne(companyId.toString());
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
          companyId.toString(),
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

    // Navigate to top job management page
    router.push(`/co/job-list/${jobId}/top-job`);
  };

  const handleViewApplicants = (jobId: string) => {
    const job = jobs.find((job) => job.jobId === jobId);
    if (!job) return;

    router.push(`/co/job-list/${jobId}/applicants`);
  };

  const handleDeleteJob = (jobId: string) => {
    const job = jobs.find((job) => job.jobId === jobId);
    if (!job) {
      toast.error('Could not find job details');
      return;
    }

    // Open delete confirmation dialog
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete || !companyId) return;

    try {
      setIsDeleting(true);
      await jobService.delete(jobToDelete.jobId);
      toast.success('Job deleted successfully');

      // Refresh job list
      const response = await jobService.getJobsByCompanyId(
        companyId.toString(),
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
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const cancelDeleteJob = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  // Loading state
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

  // Company not found state
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
        {/* Error message banner */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">
                Error loading jobs: {error}
              </p>
            </div>
          </div>
        )}

        {jobs.length === 0 && !isLoading ? (
          // Empty state when no jobs
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No Jobs Posted Yet
              </h3>
              <p className="mb-6 text-gray-600">
                Start building your team by posting your first job opening.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => router.push('/co/post-job')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Job
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </div>
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Why post a job?
                </h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Reach qualified candidates quickly</li>
                  <li>• Build your company&apos;s presence</li>
                  <li>• Streamline your hiring process</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Job
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {jobToDelete && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <Trash2 className="mt-0.5 h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800">
                    {jobToDelete.jobTitle}
                  </h4>
                  <p className="mt-1 text-sm text-red-600">
                    Job ID: {jobToDelete.jobId}
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    Posted:{' '}
                    {jobToDelete.postedDate
                      ? new Date(jobToDelete.postedDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={cancelDeleteJob}
              disabled={isDeleting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteJob}
              disabled={isDeleting}
              className="px-6"
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Job
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
