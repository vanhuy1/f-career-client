'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Search } from 'lucide-react';
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

export default function JobApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [dateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '2021-07-19',
    endDate: '2021-07-25',
  });
  const [showNewFeature, setShowNewFeature] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0); // Add this state for total count
  const dispatch = useAppDispatch();
  const applications = useApplicationList();
  const loading = useApplicationListLoadingState() === LoadingState.loading;
  const error = useApplicationListErrors();

  // Format date range for display
  const formattedDateRange = `Jul ${dateRange.startDate.split('-')[2]} - Jul ${dateRange.endDate.split('-')[2]}`;

  // Status counts
  // const statusCounts = {
  //   ALL: totalApplications,
  //   IN_REVIEW: applications.filter((app) => app.status === 'IN_REVIEW').length,
  //   INTERVIEWING: applications.filter((app) => app.status === 'INTERVIEWING')
  //     .length,
  //   ASSESSMENT: applications.filter((app) => app.status === 'ASSESSMENT')
  //     .length,
  //   OFFERED: applications.filter((app) => app.status === 'OFFERED').length,
  //   HIRED: applications.filter((app) => app.status === 'HIRED').length,
  // };

  useEffect(() => {
    const loadApplications = async () => {
      try {
        dispatch(setApplicationDetailStart());
        const response = await applicationService.getApplications();
        dispatch(setApplicationSuccess(response.data || []));
        // Capture the total from the response
        setTotal(response.total || response.data?.length || 0);
      } catch (err) {
        dispatch(setApplicationFailure(err as string));
      }
    };
    if (applications?.length === 0) {
      loadApplications();
    }
  }, [searchQuery, currentPage, dateRange, applications?.length, dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };
  return (
    <div className="flex min-h-screen w-full justify-center">
      <main className="w-[95%] origin-top scale-100 p-[2%]">
        <div className="mb-[2%] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-[calc(1.5rem+0.5vw)] font-semibold">
              Keep it up, Jake
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

        {/* <div className="mb-[3%]">
          <StatusTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            statusCounts={statusCounts}
          />
        </div> */}

        <div className="mb-[3%]">
          <div className="mb-[2%] flex flex-col gap-[2%] sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[calc(1.25rem+0.3vw)] font-semibold text-gray-800">
              Applications History
            </h2>
            <div className="flex gap-[1%]">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-[1%] flex items-center">
                  <Search className="h-[calc(1rem+0.2vw)] w-[calc(1rem+0.2vw)] text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="rounded-lg border py-[1%] pr-[2%] pl-[8%] text-[calc(0.875rem+0.1vw)] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-[1%] rounded-lg border px-[2%] py-[1%] text-[calc(0.875rem+0.1vw)] hover:bg-gray-50">
                <SlidersHorizontal className="h-[calc(1rem+0.2vw)] w-[calc(1rem+0.2vw)]" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-white">
            <ApplicationTable
              applications={applications}
              loading={loading}
              error={error}
              page={currentPage}
              pageSize={pageSize}
              total={total} // Pass the total prop here
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Pagination with responsive design */}
        {/* <div className="fixed right-[2%] bottom-[2%] left-[2%] z-10 flex justify-center">
          <div className="rounded-lg border bg-white p-[1%] shadow-md">
            <div className="flex items-center gap-[0.5%]">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-[calc(2rem+0.5vw)] w-[calc(2rem+0.5vw)]"
              >
                <ChevronLeft className="h-[calc(1rem+0.2vw)] w-[calc(1rem+0.2vw)]" />
                <span className="sr-only">Previous</span>
              </Button>

              {[...Array(Math.min(5, Math.ceil(totalApplications / 5)))].map(
                (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="icon"
                    className="h-[calc(2rem+0.5vw)] w-[calc(2rem+0.5vw)] text-[calc(0.875rem+0.1vw)]"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ),
              )}

              {Math.ceil(totalApplications / 5) > 5 && (
                <>
                  <span className="px-[1%] text-[calc(0.875rem+0.1vw)]">
                    ...
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-[calc(2rem+0.5vw)] w-[calc(2rem+0.5vw)] text-[calc(0.875rem+0.1vw)]"
                    onClick={() =>
                      handlePageChange(Math.ceil(totalApplications / 5))
                    }
                  >
                    {Math.ceil(totalApplications / 5)}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalApplications / 5)}
                className="h-[calc(2rem+0.5vw)] w-[calc(2rem+0.5vw)]"
              >
                <ChevronRight className="h-[calc(1rem+0.2vw)] w-[calc(1rem+0.2vw)]" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div> */}

        {/* Add responsive padding at the bottom */}
        <div className="h-[calc(4rem+1vw)]"></div>
      </main>
    </div>
  );
}
