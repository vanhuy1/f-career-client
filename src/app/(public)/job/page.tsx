import React from 'react';
import JobSearch from '../../../components/job-search/job-search-banner';
import JobListingsPage from '@/components/job-search/job-search-page';

export default function JobLayout() {
  return (
    <>
      <JobSearch />
      <JobListingsPage />
    </>
  );
}
