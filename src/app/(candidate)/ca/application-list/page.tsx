'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import ApplicationTable from '@/app/(candidate)/_components/applications-list/ApplicationTable';
import StatusBadge from '@/app/(candidate)/_components/applications-list/StatusBadge';
import { applicationService } from '@/services/api/applications/application-api';
import { useAppDispatch } from '@/store/hooks';
import {
  setApplicationDetailStart,
  setApplicationFailure,
  setApplicationSuccess,
  useApplicationList,
  useApplicationListErrors,
  useApplicationListLoadingState,
} from '@/services/state/applicationsSlice';
import { LoadingState } from '@/store/store.model';
import { useUser } from '@/services/state/userSlice';
import { ApplicationStatus } from '@/enums/applicationStatus';
import type { Application } from '@/types/Application';

export default function JobApplicationsPage() {
  const [searchQuery] = useState<string>('');
  // Pagination is now handled internally in the ApplicationTable component
  const [dateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '2021-07-19',
    endDate: '2021-07-25',
  });
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(
    null,
  );
  const dispatch = useAppDispatch();
  const applications = useApplicationList();
  const loading = useApplicationListLoadingState() === LoadingState.loading;
  const error = useApplicationListErrors();
  const user = useUser();

  // Format date range for display
  const formattedDateRange = `Jul ${dateRange.startDate.split('-')[2]} - Jul ${dateRange.endDate.split('-')[2]}`;

  useEffect(() => {
    const loadApplications = async () => {
      try {
        dispatch(setApplicationDetailStart());
        const response = await applicationService.getApplications();
        dispatch(setApplicationSuccess(response.data || []));
      } catch (err) {
        dispatch(setApplicationFailure(err as string));
      }
    };
    if (applications?.length === 0) {
      loadApplications();
    }
  }, [searchQuery, dateRange, applications?.length, dispatch]);

  const filteredApplications = applications
    ? applications.filter((app: Application) =>
        statusFilter ? app.status === statusFilter : true,
      )
    : null;

  // Get count of applications by status
  const getStatusCount = (status: ApplicationStatus) => {
    return (
      applications?.filter((app: Application) => app.status === status)
        .length || 0
    );
  };

  return (
    <div className="flex min-h-screen w-full justify-center">
      <main className="w-[95%] origin-top scale-100 p-[2%]">
        <div className="mb-[2%] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-[calc(1.5rem+0.5vw)] font-semibold">
              {statusFilter
                ? `${statusFilter === 'INTERVIEW' ? 'Interviewing' : statusFilter === 'IN_REVIEW' ? 'In Review' : statusFilter === 'SHORTED_LIST' ? 'Shortlisted' : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Applications`
                : `Keep it up, ${user?.data.name}`}
            </h2>
            <p className="text-muted-foreground text-[calc(0.875rem+0.2vw)]">
              {statusFilter
                ? `Showing ${filteredApplications?.length || 0} ${statusFilter.toLowerCase()} applications`
                : 'Here is job applications status from July 19 - July 25.'}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-[1%] whitespace-nowrap">
            <span className="text-[calc(0.875rem+0.1vw)]">
              {formattedDateRange}
            </span>
            <Calendar className="h-[calc(1.25rem+0.2vw)] w-[calc(1.25rem+0.2vw)] text-indigo-600" />
          </div>
        </div>

        {/* Application Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {Object.values(ApplicationStatus).map((status) => (
            <div
              key={status}
              className={`cursor-pointer rounded-lg border ${
                status === statusFilter
                  ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200'
                  : 'bg-white'
              } p-4 shadow-sm transition-all hover:shadow-md`}
              onClick={() =>
                setStatusFilter(status === statusFilter ? null : status)
              }
            >
              <div className="mb-2 flex justify-between">
                <h3
                  className={`font-medium ${status === statusFilter ? 'text-blue-700' : 'text-gray-700'}`}
                >
                  {status === 'INTERVIEW'
                    ? 'Interviewing'
                    : status === 'IN_REVIEW'
                      ? 'In Review'
                      : status === 'SHORTED_LIST'
                        ? 'Shortlisted'
                        : status.charAt(0) + status.slice(1).toLowerCase()}
                </h3>
                <StatusBadge status={status} />
              </div>
              <p
                className={`text-2xl font-bold ${status === statusFilter ? 'text-blue-700' : ''}`}
              >
                {getStatusCount(status)}
              </p>
              <p
                className={`text-sm ${status === statusFilter ? 'text-blue-600' : 'text-gray-500'}`}
              >
                {status === 'APPLIED' && 'Applications awaiting review'}
                {status === 'IN_REVIEW' && 'Applications under review'}
                {status === 'SHORTED_LIST' && 'Selected for next round'}
                {status === 'INTERVIEW' && 'Ongoing interviews'}
                {status === 'HIRED' && 'Successful applications'}
                {status === 'REJECTED' && 'Unsuccessful applications'}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-[3%]">
          <div className="rounded-lg border bg-white">
            <ApplicationTable
              applications={filteredApplications}
              loading={loading}
              error={error}
            />
          </div>
        </div>
        <div className="h-[calc(4rem+1vw)]"></div>
      </main>
    </div>
  );
}
