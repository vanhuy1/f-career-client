'use client';

import type React from 'react';
import { useSearchParams } from 'next/navigation';
import JobSearchForm from '@/components/common/JobSearchForm';

export default function JobSearchInterface() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams?.get('q') || '';
  const initialLocation = searchParams?.get('location') || '';

  return (
    <div className="bg-[#f8f8fd]">
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <JobSearchForm
          initialKeyword={initialKeyword}
          initialLocation={initialLocation}
          className="mb-4"
          preserveFilters={true}
          searchParams={searchParams}
        />

        <div className="mt-4 text-gray-500">
          <span>Popular: </span>
          <span className="text-gray-600">
            UI Designer, UX Researcher, Android, Admin
          </span>
        </div>
      </div>
    </div>
  );
}
