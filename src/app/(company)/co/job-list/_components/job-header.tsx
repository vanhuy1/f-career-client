'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  useJobDetailById,
  useJobDetailLoadingState,
} from '@/services/state/jobSlice';
import { LoadingState } from '@/store/store.model';
import { formatEmploymentType } from '@/utils/formatters';
import { applicationService } from '@/services/api/applications/application-api';

export function JobHeader() {
  const router = useRouter();
  const params = useParams() || {};
  const jobId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  // Use Redux state instead of local state
  const jobData = useJobDetailById(jobId);
  const loadingState = useJobDetailLoadingState();
  const isLoading = loadingState === LoadingState.loading;

  // State for applicants count
  const [applicantsCount, setApplicantsCount] = useState(0);

  // Fetch applicants count
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

  // Fetch applicants count when job data is available
  useEffect(() => {
    if (jobData) {
      fetchApplicantsCount();
    }
  }, [jobData, fetchApplicantsCount]);

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/co/job-list')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          {isLoading ? (
            <div className="h-12 w-48 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                {jobData?.title || 'Job TITLE'}
              </h1>
              <p className="text-gray-600">
                {jobData?.category?.name || 'N/A'} •{' '}
                {formatEmploymentType(jobData?.typeOfEmployment)} •{' '}
                {applicantsCount} Applications
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
