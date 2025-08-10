'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Button } from '@/components/ui/button';

export default function JobApplicationsPage() {
  // Page-level state
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | null>(
    null,
  );
  const dispatch = useAppDispatch();
  const applications = useApplicationList();
  const loading = useApplicationListLoadingState() === LoadingState.loading;
  const error = useApplicationListErrors();
  const user = useUser();

  // Static date range formatting (kept simple)
  const formattedDateRange = useMemo(() => {
    const dateRange = { startDate: '2021-07-19', endDate: '2021-07-25' };
    const start = dateRange.startDate.split('-')[2];
    const end = dateRange.endDate.split('-')[2];
    return `Jul ${start} – Jul ${end}`;
  }, []);

  // Load applications (unchanged logic)
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
    if ((applications?.length ?? 0) === 0) {
      loadApplications();
    }
  }, [applications?.length, dispatch]);

  // Filtered data by status
  const filteredApplications = useMemo(() => {
    if (!applications) return null;
    return statusFilter
      ? applications.filter((app: Application) => app.status === statusFilter)
      : applications;
  }, [applications, statusFilter]);

  // Counts
  const getStatusCount = (status: ApplicationStatus) =>
    applications?.filter((app: Application) => app.status === status).length ||
    0;

  // Friendly title and subtitle
  const pageTitle = statusFilter
    ? `${statusFilter === 'INTERVIEW' ? 'Interviewing' : statusFilter === 'IN_REVIEW' ? 'In Review' : statusFilter === 'SHORTED_LIST' ? 'Shortlisted' : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Applications`
    : `Keep it up, ${user?.data.name ?? 'there'}`;

  const pageSubtitle = statusFilter
    ? `Showing ${filteredApplications?.length || 0} ${statusFilter.toLowerCase()} applications`
    : 'Here is job applications status from July 19 - July 25.';

  return (
    <div className="flex min-h-screen w-full justify-center">
      <main className="w-[95%] p-[2%]">
        {/* Header */}
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-[calc(1.25rem+0.4vw)] font-semibold tracking-tight">
              {pageTitle}
            </h2>
            <p className="text-muted-foreground text-[calc(0.875rem+0.05vw)]">
              {pageSubtitle}
            </p>
          </div>
          <div
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-slate-700"
            aria-label="Date range"
          >
            <span>{formattedDateRange}</span>
            <Calendar className="h-4 w-4 text-slate-500" />
          </div>
        </header>

        {/* Status filter bar (simplified, professional) */}
        <section className="mb-4 rounded-lg border bg-white p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={statusFilter === null ? 'default' : 'outline'}
              onClick={() => setStatusFilter(null)}
              className="h-8"
            >
              All
              <span className="text-muted-foreground ml-2 text-xs">
                ({applications?.length ?? 0})
              </span>
            </Button>
            {Object.values(ApplicationStatus).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() =>
                  setStatusFilter(statusFilter === status ? null : status)
                }
                className="h-8"
              >
                <StatusBadge
                  status={status}
                  className="border-transparent bg-transparent px-0"
                />
                <span className="text-muted-foreground ml-2 text-xs">
                  {getStatusCount(status)}
                </span>
              </Button>
            ))}
          </div>
        </section>

        {/* Table (unchanged) */}
        <section className="rounded-lg bg-white">
          <ApplicationTable
            applications={filteredApplications}
            loading={loading}
            error={error}
          />
        </section>

        <div className="h-12" />
      </main>
    </div>
  );
}
