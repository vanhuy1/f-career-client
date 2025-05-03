import ROUTES from '@/constants/navigation';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function NotLoggedInScreen() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 text-9xl text-pink-100 opacity-20">
        [
      </div>
      <div className="absolute top-1/4 right-0 text-9xl text-blue-100 opacity-20">
        ]
      </div>
      <div className="absolute bottom-20 left-10 h-20 w-20 rounded-full bg-pink-50 opacity-20"></div>
      <div className="absolute right-10 bottom-40 h-40 w-40 rounded-full bg-blue-50 opacity-20"></div>

      {/* Main content */}
      <div className="flex max-w-md flex-col items-center justify-center gap-6 px-4">
        {/* Lock icon */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/80 shadow-sm"></div>
          <Lock
            className="relative h-16 w-16 text-[#4557a0]"
            strokeWidth={1.5}
          />
        </div>

        {/* Text content */}
        <h1 className="mt-2 text-center text-3xl font-semibold text-[#4557a0]">
          Oops! You&apos;re not logged in
        </h1>

        <p className="mb-4 text-center text-gray-700">
          Please log in to view this page.
        </p>

        {/* GitHub login button */}
        <Link
          href={ROUTES.AUTH.SIGNIN.path}
          className="flex items-center gap-2 rounded-full bg-[#24292e] px-8 py-3 font-medium tracking-wide text-white transition-colors hover:bg-[#24292e]/90"
        >
          LOG IN
        </Link>
      </div>
    </div>
  );
}
