'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BreadcrumbNavigation from '@/app/(public)/_components/breadcrump-navigation';
import JobHeader from '@/components/job-search/job-header';
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
import { bookmarkJobService } from '@/services/api/bookmark/bookmark-job.api';
import { LoadingState } from '@/store/store.model';
import { toast } from 'react-toastify';
import { useUser } from '@/services/state/userSlice';

// Import new components
import JobDetailSkeleton from './components/JobDetailSkeleton';
import JobDetailError from './components/JobDetailError';
import JobDetailNotFound from './components/JobDetailNotFound';
import JobDetailContent from './components/JobDetailContent';
import JobDetailSidebar from './components/JobDetailSidebar';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const dispatch = useDispatch();
  const user = useUser();

  // Redux hooks
  const job = useJobDetailById(jobId);
  const loadingState = useJobDetailLoadingState();
  const error = useJobDetailErrors();
  const isLoading = loadingState === LoadingState.loading;

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Check bookmark status
  const checkBookmarkStatus = useCallback(async () => {
    if (!jobId || !user) return;
    try {
      const response = await bookmarkJobService.checkBookmark(jobId);
      setIsBookmarked(response.bookmarked);
    } catch (error) {
      console.error('Failed to check bookmark status:', error);
    }
  }, [jobId, user]);

  // Handle bookmark change
  const handleBookmarkChange = (bookmarked: boolean) => {
    setIsBookmarked(bookmarked);
  };

  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;

      // Chỉ fetch data khi chưa có trong store
      if (!job) {
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
      }
    };

    fetchJobData();
  }, [jobId, job, dispatch]);

  // Check bookmark status when job or user changes
  useEffect(() => {
    if (job && user) {
      checkBookmarkStatus();
    }
  }, [job, user, checkBookmarkStatus]);

  if (error) {
    return <JobDetailError error={error} />;
  }

  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (!job) {
    return <JobDetailNotFound />;
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <BreadcrumbNavigation
        company={job.company}
        jobTitle={{ title: job.title }}
        companyId={job.company.id}
      />
      <JobHeader
        jobId={job.id!}
        companyName={job.company.companyName}
        jobTitle={job.title}
        location={job.location}
        jobType={job.typeOfEmployment}
        isBookmarked={isBookmarked}
        onBookmarkChange={handleBookmarkChange}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JobDetailContent job={job} />
        </div>
        <div className="space-y-8">
          <JobDetailSidebar job={job} />
        </div>
      </div>
    </div>
  );
}
