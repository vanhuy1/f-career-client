import React from 'react';
import JobSearch from '../_components/job-search';
import JobListingsPage from '@/components/job-search/job-search-page';

export default function JobLayout() {
  return (
    <>
      <JobSearch />
      <JobListingsPage />
    </>
  );
}
