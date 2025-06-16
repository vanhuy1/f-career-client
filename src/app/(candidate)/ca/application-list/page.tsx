'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import ApplicationTable from '@/app/(candidate)/_components/applications-list/ApplicationTable';
import NewFeatureAlert from '@/app/(candidate)/_components/applications-list/NewFeatureAlert';
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

export default function JobApplicationsPage() {
  const [searchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Convert to state variable
  const [dateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '2021-07-19',
    endDate: '2021-07-25',
  });
  const [showNewFeature, setShowNewFeature] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
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
        setTotal(response.total || response.data?.length || 0);
      } catch (err) {
        dispatch(setApplicationFailure(err as string));
      }
    };
    if (applications?.length === 0) {
      loadApplications();
    }
  }, [searchQuery, currentPage, dateRange, applications?.length, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Add handler for page size changes
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="flex min-h-screen w-full justify-center">
      <main className="w-[95%] origin-top scale-100 p-[2%]">
        <div className="mb-[2%] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-[calc(1.5rem+0.5vw)] font-semibold">
              Keep it up, {user?.data.name}
            </h2>
            <p className="text-muted-foreground text-[calc(0.875rem+0.2vw)]">
              Here is job applications status from July 19 - July 25.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-[1%] whitespace-nowrap">
            <span className="text-[calc(0.875rem+0.1vw)]">
              {formattedDateRange}
            </span>
            <Calendar className="h-[calc(1.25rem+0.2vw)] w-[calc(1.25rem+0.2vw)] text-indigo-600" />
          </div>
        </div>

        {showNewFeature && (
          <div className="mb-[3%]">
            <NewFeatureAlert onClose={() => setShowNewFeature(false)} />
          </div>
        )}

        <div className="mb-[3%]">
          <div className="rounded-lg border bg-white">
            <ApplicationTable
              applications={applications}
              loading={loading}
              error={error}
              page={currentPage}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange} // Add the missing prop
            />
          </div>
        </div>
        <div className="h-[calc(4rem+1vw)]"></div>
      </main>
    </div>
  );
}
