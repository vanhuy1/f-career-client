import JobSearch from '../_components/job-search';

export default function JobLayout() {
  return (
    <>
      <JobSearch />
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Job</h1>
        <p className="mt-4 text-lg">This is the Job page.</p>
      </div>
    </>
  );
}
