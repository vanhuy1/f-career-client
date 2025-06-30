'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown, ListFilter } from 'lucide-react';
import JobCard from '@/components/job-search/job-card';
import Pagination from '@/components/job-search/pagination';
import JobFilterSidebar from '@/components/job-search/filter-sidebar';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import {
  setJobFailure,
  setJobStart,
  setJobSuccess,
  useJobLoadingState,
  useJobs,
} from '@/services/state/jobSlice';
import { LoadingState } from '@/store/store.model';
import LoadingScreen from '@/pages/LoadingScreen';
import { jobSearchService } from '@/services/api/job-search/job-search.api';
import { useSearchParams } from 'next/navigation';
import { JobSearchSortBy, JobSearchRequest } from '@/types/JobSearch';
import { employmentType } from '@/enums/employmentType';
import FilterSummary from '@/components/job-search/filter-summary';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatSalaryRange } from '../../utils/formatters';

// Skeleton loader for job cards
const JobCardSkeleton = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-start gap-4">
      <Skeleton className="h-12 w-12 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function JobListingsPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const jobs = useJobs();
  const Loading = useJobLoadingState();
  const isLoading = Loading === LoadingState.loading;

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<JobSearchSortBy>('relevance');
  const [viewMode] = useState<'grid' | 'list'>('list');
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const limit = 10;

  // Use the shared filter visibility state
  useEffect(() => {
    // Initialize from localStorage
    import('@/lib/utils').then(({ getFilterVisibility }) => {
      setShowFilters(getFilterVisibility());
    });

    // Listen for changes from the banner component
    const handleVisibilityChange = (e: CustomEvent<boolean>) => {
      setShowFilters(e.detail);
    };

    window.addEventListener(
      'filterVisibilityChanged',
      handleVisibilityChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        'filterVisibilityChanged',
        handleVisibilityChange as EventListener,
      );
    };
  }, []);

  const toggleFilters = () => {
    import('@/lib/utils').then(({ toggleFilterVisibility }) => {
      const newState = toggleFilterVisibility();
      setShowFilters(newState);
    });
  };

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoadingJobs(true);
        dispatch(setJobStart());

        // Build search parameters from URL query params and current state
        const params: JobSearchRequest = {
          q: searchParams?.get('q') || undefined,
          location: searchParams?.get('location') || undefined,
          page: currentPage,
          limit,
          sortBy,
        };

        const employmentTypesParam = searchParams?.get('employmentTypes');
        if (employmentTypesParam) {
          params.employmentTypes = employmentTypesParam.split(
            ',',
          ) as employmentType[];
        }

        // Categories filter
        const categoriesParam = searchParams?.get('categoryIds');
        if (categoriesParam) {
          params.categoryIds = categoriesParam.split(',');
        }

        // Salary range filter
        const salaryMinParam = searchParams?.get('salaryMin');
        if (salaryMinParam) {
          params.salaryMin = parseInt(salaryMinParam);
        }

        const salaryMaxParam = searchParams?.get('salaryMax');
        if (salaryMaxParam) {
          params.salaryMax = parseInt(salaryMaxParam);
        }

        const response = await jobSearchService.searchJobs(params);

        dispatch(setJobSuccess(response.data));
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        dispatch(setJobFailure(error as string));
      } finally {
        setLoadingJobs(false);
      }
    }

    fetchJobs();
  }, [searchParams, currentPage, sortBy, dispatch]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: JobSearchSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const totalPages = Math.ceil(totalItems / limit);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-8xl container mx-auto p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showFilters
              ? 'max-h-[2000px] w-full shrink-0 opacity-100 md:w-64'
              : 'max-h-0 w-0 opacity-0 md:max-h-0'
          }`}
        >
          <div
            className={`transition-all duration-300 ${showFilters ? 'opacity-100' : 'opacity-0'}`}
          >
            <JobFilterSidebar />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          {/* Mobile Filter Toggle Button - only shown in mobile view as a backup */}
          <div className="mb-4 md:hidden">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={toggleFilters}
            >
              <ListFilter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden items-center gap-1 md:flex"
                onClick={toggleFilters}
              >
                <ListFilter className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">All Jobs</h1>
                <p className="text-sm text-gray-500">
                  Showing {totalItems} results
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 text-sm font-medium">
                    {sortBy === 'relevance' && 'Most relevant'}
                    {sortBy === 'date_posted' && 'Date posted'}
                    {sortBy === 'salary_high_to_low' && 'Salary (High to Low)'}
                    {sortBy === 'salary_low_to_high' && 'Salary (Low to High)'}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleSortChange('relevance')}
                    >
                      Most relevant
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange('date_posted')}
                    >
                      Date posted
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange('salary_high_to_low')}
                    >
                      Salary (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange('salary_low_to_high')}
                    >
                      Salary (Low to High)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Filter summary badges */}
          <FilterSummary />

          {/* Job cards */}
          {loadingJobs ? (
            // Loading state
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <JobCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
          ) : jobs?.length === 0 ? (
            // No results found
            <div className="my-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <ListFilter className="mb-2 h-10 w-10 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800">
                No jobs found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search filters or search terms
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid view
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {jobs?.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  typeOfEmployment={job.typeOfEmployment}
                  category={job.category}
                  priorityPosition={job.priorityPosition || 3}
                  salary={formatSalaryRange(job.salaryMin, job.salaryMax)}
                />
              ))}
            </div>
          ) : (
            // List view
            <div className="space-y-4">
              {jobs?.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  typeOfEmployment={job.typeOfEmployment}
                  category={job.category}
                  priorityPosition={job.priorityPosition || 3}
                  salary={formatSalaryRange(job.salaryMin, job.salaryMax)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loadingJobs && jobs && jobs.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
