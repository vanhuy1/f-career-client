'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Search } from 'lucide-react';
import ApplicationTable from '@/app/(candidate)/_components/applications-list/ApplicationTable';
import StatusTabs from '@/app/(candidate)/_components/applications-list/StatusTabs';
import type {
  Application,
  ApplicationStatus,
  FetchApplicationsRequest,
} from '@/types/Application';
import { fetchApplications } from '@/app/(candidate)/_components/applications-list/utils/api';
import NewFeatureAlert from '@/app/(candidate)/_components/applications-list/NewFeatureAlert';
import DateRangePicker from '@/app/(candidate)/_components/applications-list/DateRangePicker';

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalApplications, setTotalApplications] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '2021-07-19',
    endDate: '2021-07-25',
  });
  const [showNewFeature, setShowNewFeature] = useState<boolean>(true);

  // Format date range for display
  const formattedDateRange = `Jul ${dateRange.startDate.split('-')[2]} - Jul ${dateRange.endDate.split('-')[2]}`;

  // Status counts
  const statusCounts = {
    ALL: totalApplications,
    IN_REVIEW: applications.filter((app) => app.status === 'IN_REVIEW').length,
    INTERVIEWING: applications.filter((app) => app.status === 'INTERVIEWING')
      .length,
    ASSESSMENT: applications.filter((app) => app.status === 'ASSESSMENT')
      .length,
    OFFERED: applications.filter((app) => app.status === 'OFFERED').length,
    HIRED: applications.filter((app) => app.status === 'HIRED').length,
  };

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const request: FetchApplicationsRequest = {
          page: currentPage,
          limit: 5,
          status: activeTab === 'ALL' ? undefined : activeTab,
          searchQuery: searchQuery || undefined,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        };

        const response = await fetchApplications(request);
        setApplications(response.applications);
        setTotalApplications(response.total);
      } catch (err) {
        setError('Failed to load applications. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [activeTab, searchQuery, currentPage, dateRange]);

  const handleTabChange = (tab: ApplicationStatus | 'ALL') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Keep it up, Jake</h1>
          <p className="mt-1 text-gray-600">
            Here is job applications status from July 19 - July 25.
          </p>
        </div>
        <div className="relative">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
            displayText={formattedDateRange}
          />
        </div>
      </div>

      {showNewFeature && (
        <NewFeatureAlert onClose={() => setShowNewFeature(false)} />
      )}

      <div className="mt-8">
        <StatusTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          statusCounts={statusCounts}
        />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Applications History
          </h2>
          <div className="flex gap-2">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <ApplicationTable
          applications={applications}
          loading={loading}
          error={error}
        />

        {/* Pagination with shadcn components */}
        <div className="fixed right-0 bottom-4 left-0 z-10 flex justify-center">
          <div className="rounded-lg border bg-white p-2 shadow-md">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>

              {[...Array(Math.min(5, Math.ceil(totalApplications / 5)))].map(
                (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ),
              )}

              {Math.ceil(totalApplications / 5) > 5 && (
                <>
                  <span className="px-1">...</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
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
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Add padding at the bottom to prevent content from being hidden behind the fixed pagination */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}
