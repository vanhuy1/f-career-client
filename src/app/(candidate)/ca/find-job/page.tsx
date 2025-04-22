import JobSearchInterface from '@/app/(public)/_components/job-search';
import JobListingsPage from '@/components/job-search/job-search-page';

const FindJob = () => {
  return (
    <div>
      <JobSearchInterface />
      <JobListingsPage />
    </div>
  );
};

export default FindJob;
