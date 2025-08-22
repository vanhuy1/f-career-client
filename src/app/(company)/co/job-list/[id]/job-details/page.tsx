'use client';

import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { useJobDetailErrors } from '@/services/state/jobSlice';
import { useJobDetail } from '@/hooks/use-job-detail';
import { applicationService } from '@/services/api/applications/application-api';

// Import components
import { JobDetailsView } from '../../_components/job-details-view';
import JobDetailSkeleton from './components/JobDetailSkeleton';
import JobDetailError from './components/JobDetailError';
import JobDetailNotFound from './components/JobDetailNotFound';
import { mapJobToJobDetails } from '../../_components/lib/mappers';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const [applicantsCount, setApplicantsCount] = useState(0);

  // Use custom hook
  const { job, isLoading } = useJobDetail(jobId);
  const error = useJobDetailErrors();

  // Simple refresh function for retry/update
  const refreshData = useCallback(async () => {
    window.location.reload();
  }, []);

  const fetchApplicantsCount = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await applicationService.getApplicationByJobId({
        jobId: jobId as string,
        offset: 0,
        limit: 100,
      });

      if (response && response.applications) {
        setApplicantsCount(response.applications.length);
      } else {
        setApplicantsCount(0);
      }
    } catch (error) {
      console.error('Error fetching applicants count:', error);
      setApplicantsCount(0);
    }
  }, [jobId]);

  useEffect(() => {
    if (job) {
      fetchApplicantsCount();
    }
  }, [job, fetchApplicantsCount]);

  if (error) {
    return <JobDetailError error={error} onRetry={refreshData} />;
  }

  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (!job) {
    return <JobDetailNotFound />;
  }

  // Transform the Job data to JobDetails format for the UI
  const jobDetails = mapJobToJobDetails(job);

  return (
    <JobDetailsView
      job={jobDetails}
      originalJob={job}
      onJobUpdate={refreshData}
      applicantsCount={applicantsCount}
    />
  );
}
