'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/api/jobs/job-api';
import { companyService } from '@/services/api/company/company-api';
import {
  setJobStart,
  setJobSuccess,
  setJobFailure,
  useJobs,
  useJobLoadingState,
  useJobErrors,
} from '@/services/state/jobSlice';
import { LoadingState as ReduxLoadingState } from '@/store/store.model';
import { toast } from 'react-toastify';
import { useUser } from '@/services/state/userSlice';
import {
  useCompanyDetailById,
  useCompanyDetailLoadingState,
  setCompanyDetailStart,
  setCompanyDetailSuccess,
  setCompanyDetailFailure,
} from '@/services/state/companySlice';

// Components
import JobListTable from './_components/job-list-table';
import JobListPagination from './_components/job-list-pagination';
import LoadingStateComponent from './_components/loading-state';
import ErrorState from './_components/error-state';
import EmptyState from './_components/empty-state';

export default function JobListingDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useUser();

  // Redux hooks
  const jobs = useJobs() || [];
  const jobLoadingState = useJobLoadingState();
  const jobErrors = useJobErrors();
  const isLoading = jobLoadingState === ReduxLoadingState.loading;

  // Company data from Redux
  const companyId = user?.data?.companyId;
  const company = useCompanyDetailById(companyId || '');
  const companyLoadingState = useCompanyDetailLoadingState();
  const isCompanyLoading = companyLoadingState === ReduxLoadingState.loading;

  // Fetch company data if not available
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId || company) return;

      try {
        dispatch(setCompanyDetailStart());
        const data = await companyService.findOne(companyId);
        dispatch(setCompanyDetailSuccess(data));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to load company data';
        dispatch(setCompanyDetailFailure(errorMessage));
      }
    };

    fetchCompanyData();
  }, [companyId, company, dispatch]);

  // Fetch jobs when company data is available
  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId) return;

      try {
        dispatch(setJobStart());
        const response = await jobService.findByCompany(
          companyId,
          itemsPerPage,
          (currentPage - 1) * itemsPerPage,
        );
        dispatch(setJobSuccess(response.data));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load jobs';
        dispatch(setJobFailure(errorMessage));
        toast.error('Failed to load jobs. Please try again.');
      }
    };

    if (!isCompanyLoading) {
      fetchJobs();
    }
  }, [currentPage, itemsPerPage, dispatch, companyId, isCompanyLoading]);

  // Event handlers
  const handleViewDetails = (jobId: string) => {
    if (!jobId) return;
    router.push(`/job/${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    if (!jobId) return;
    router.push(`/co/edit-job/${jobId}`);
  };

  const handleViewApplicants = (jobId: string) => {
    if (!jobId) return;
    router.push(`/co/job/${jobId}/applicants`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!jobId) return;
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.delete(jobId);
        // Refresh job list
        const response = await jobService.findByCompany(
          companyId!,
          itemsPerPage,
          (currentPage - 1) * itemsPerPage,
        );
        dispatch(setJobSuccess(response.data));
        toast.success('Job deleted successfully');
      } catch (error) {
        // toast.error(error as string)
        console.log('Failed to delete job:', error);
      }
    }
  };

  // Loading and error states
  if (isLoading || isCompanyLoading) {
    return <LoadingStateComponent />;
  }

  if (jobErrors) {
    return <ErrorState error={jobErrors} />;
  }

  if (!company) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <JobListTable
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
          totalItems={jobs.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
