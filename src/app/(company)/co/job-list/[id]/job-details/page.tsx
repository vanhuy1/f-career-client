'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  setJobDetailStart,
  setJobDetailSuccess,
  setJobDetailFailure,
  useJobDetailById,
  useJobDetailLoadingState,
  useJobDetailErrors,
} from '@/services/state/jobSlice';
import { jobService } from '@/services/api/jobs/job-api';
import { LoadingState } from '@/store/store.model';
import { toast } from 'react-toastify';

// Import components
import { JobDetailsView } from '../../_components/job-details-view';
import JobDetailSkeleton from './components/JobDetailSkeleton';
import JobDetailError from './components/JobDetailError';
import JobDetailNotFound from './components/JobDetailNotFound';
import { mapJobToJobDetails } from '../../_components/lib/mappers';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const dispatch = useDispatch();

  // Redux hooks
  const job = useJobDetailById(jobId);
  const loadingState = useJobDetailLoadingState();
  const error = useJobDetailErrors();
  const isLoading = loadingState === LoadingState.loading;

  const fetchJobData = async () => {
    if (!jobId) return;

    dispatch(setJobDetailStart());
    try {
      const data = await jobService.findOne(jobId);
      dispatch(setJobDetailSuccess(data));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load job data';
      dispatch(setJobDetailFailure(errorMessage));
      console.error('Failed to fetch job data:', err);
      toast.error('Failed to load job data. Please try again.', {
        toastId: 'job-data-error',
      });
    }
  };

  useEffect(() => {
    if (!job) {
      fetchJobData();
    }
  }, [jobId, job, dispatch]);

  if (error) {
    return <JobDetailError error={error} onRetry={fetchJobData} />;
  }

  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (!job) {
    return <JobDetailNotFound />;
  }

  // Transform the Job data to JobDetails format for the UI
  const jobDetails = mapJobToJobDetails(job);

  return <JobDetailsView job={jobDetails} />;
}
