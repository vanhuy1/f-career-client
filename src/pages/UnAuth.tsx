import ROUTES from '@/constants/navigation';
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <Link
        href={ROUTES.HOMEPAGE.path}
        className="mt-4 text-blue-500 hover:underline"
      >
        Go Back to Home
      </Link>
    </div>
  );
}
