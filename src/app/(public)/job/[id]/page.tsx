'use client';

import { useEffect } from 'react';
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
import { LoadingState } from '@/store/store.model';
import { toast } from 'react-toastify';

// Import new components
import JobDetailSkeleton from './components/JobDetailSkeleton';
import JobDetailError from './components/JobDetailError';
import JobDetailNotFound from './components/JobDetailNotFound';
import JobDetailContent from './components/JobDetailContent';
import JobDetailSidebar from './components/JobDetailSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/app/(candidate)/_components/applications-list/StatusBadge';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const dispatch = useDispatch();

  // Redux hooks
  const job = useJobDetailById(jobId);
  const loadingState = useJobDetailLoadingState();
  const error = useJobDetailErrors();
  const isLoading = loadingState === LoadingState.loading;

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
        jobId={job.id}
        companyName={job.company.companyName}
        jobTitle={job.title}
        location={job.location}
        jobType={job.typeOfEmployment}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JobDetailContent job={job} />
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500">Current Status</h3>
                  <div className="mt-1">
                    <StatusBadge status={'OFFERED'} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Applied On</h3>
                  <p className="font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Last Updated</h3>
                  <p className="font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <JobDetailSidebar job={job} />
        </div>
      </div>
    </div>
  );
}
