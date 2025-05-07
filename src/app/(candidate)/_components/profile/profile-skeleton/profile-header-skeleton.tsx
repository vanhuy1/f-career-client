'use client';

import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

export function ProfileHeaderSkeleton() {
  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Cover image skeleton */}
      <div className="relative h-32 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-white opacity-50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative px-6 pb-6">
        <div className="mt-4 flex flex-col items-start gap-5 md:flex-row md:items-end">
          {/* Profile picture skeleton */}
          <div className="relative -mt-16">
            <div className="h-32 w-32 animate-pulse overflow-hidden rounded-full border-4 border-white bg-gray-200"></div>
          </div>

          <div className="flex-1 pt-2 md:pt-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                {/* Name skeleton */}
                <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>

                {/* Title and company skeleton */}
                <div className="mt-2 h-5 w-64 animate-pulse rounded-md bg-gray-200"></div>

                {/* Location skeleton */}
                <div className="mt-2 h-5 w-32 animate-pulse rounded-md bg-gray-200"></div>
              </div>

              {/* Button skeleton */}
              <div className="h-10 w-28 animate-pulse rounded-md bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Badge skeleton (optional) */}
        <div className="mt-4">
          <div className="h-6 w-48 animate-pulse rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
