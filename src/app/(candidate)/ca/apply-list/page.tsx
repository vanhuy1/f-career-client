import ROUTES from '@/constants/navigation';
import Link from 'next/link';

const ApplicationList = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Application List</h1>
      <p className="text-gray-500">No applications found.</p>
      <p className="text-gray-500">Please check back later.</p>
      <p className="text-gray-500">Or apply for a job.</p>
      <Link href={ROUTES.HOMEPAGE.path}>
        <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Apply for a Job
        </button>
      </Link>
    </div>
  );
};

export default ApplicationList;
