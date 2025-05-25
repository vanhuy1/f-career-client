'use client';
import React, { useEffect, useState } from 'react';
import { ChevronDown, Grid, List } from 'lucide-react';
import JobCard from '@/components/job-search/job-card';
import Pagination from '@/components/job-search/pagination';
import JobFilterSidebar from '@/components/job-search/filter-sidebar';
import { jobService } from '@/services/api/jobs/job-api';
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

export default function JobListingsPage() {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const limit = 10;

  const dispatch = useDispatch();
  const jobs = useJobs();
  const Loading = useJobLoadingState();
  const isLoading = Loading === LoadingState.loading;

  useEffect(() => {
    async function fetchJobs() {
      try {
        dispatch(setJobStart());
        const res = await jobService.findAll(limit, (page - 1) * limit);
        dispatch(setJobSuccess(res.data));
        setCount(res.meta.count);
      } catch (error) {
        dispatch(setJobFailure(error as string));
      }
    }
    setPage(1);
    if (jobs?.length === 0) {
      fetchJobs();
    }
  }, [page, limit, dispatch, jobs?.length]);

  const totalPages = Math.ceil(count / limit);

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
              <p className="text-sm text-gray-500">Showing {count} results</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  Most relevant
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              <div className="flex rounded border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`border-r p-2 ${
                    viewMode === 'grid' ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list' ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Job cards */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {jobs?.map((job) => (
                <JobCard
                  key={job.id}
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
              currentPage={page}
              totalPages={totalPages}
              // onPageChange={newPage => setPage(newPage)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
