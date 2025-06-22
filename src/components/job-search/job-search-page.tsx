'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import JobCard from '@/components/job-search/job-card';
import Pagination from '@/components/job-search/pagination';
import JobFilterSidebar from '@/components/job-search/filter-sidebar';
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
import { JobSearchSortBy } from '@/types/JobSearch';

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

  const limit = 10;

  useEffect(() => {
    async function fetchJobs() {
      try {
        dispatch(setJobStart());

        // Build search parameters from URL query params and current state
        const params = {
          q: searchParams?.get('q') || undefined,
          location: searchParams?.get('location') || undefined,
          page: currentPage,
          limit,
          sortBy,
        };

        const response = await jobSearchService.searchJobs(params);

        dispatch(setJobSuccess(response.data));
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        dispatch(setJobFailure(error as string));
      }
    }

    fetchJobs();
  }, [searchParams, currentPage, sortBy, dispatch]);

  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

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
        <div className="w-full shrink-0 md:w-64">
          <JobFilterSidebar />
        </div>

        {/* Main */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">All Jobs</h1>
              <p className="text-sm text-gray-500">
                Showing {totalItems} results
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div
                  className="flex cursor-pointer items-center gap-1 text-sm font-medium"
                  onClick={() =>
                    handleSortChange(
                      sortBy === 'relevance' ? 'date_posted' : 'relevance',
                    )
                  }
                >
                  {sortBy === 'relevance' ? 'Most relevant' : 'Date posted'}
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Job cards */}
          {viewMode === 'grid' ? (
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
                />
              ))}
            </div>
          ) : (
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
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              // onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
