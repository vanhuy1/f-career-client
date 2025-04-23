import JobSearchInterface from '@/components/job-search/job-search-banner';
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
