import { ShieldX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AccessDeniedScreen() {
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
        {/* Shield icon */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/80 shadow-sm"></div>
          <ShieldX
            className="relative h-16 w-16 text-[#a04557]"
            strokeWidth={1.5}
          />
        </div>

        {/* Text content */}
        <h1 className="mt-2 text-center text-3xl font-semibold text-[#a04557]">
          Access Denied
        </h1>

        <p className="mb-4 text-center text-gray-700">
          You don&apos;t have permission to view this page.
        </p>

        {/* Action buttons */}
        <div className="flex w-full max-w-xs flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-center font-medium tracking-wide text-gray-800 transition-colors hover:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
