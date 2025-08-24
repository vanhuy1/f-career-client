'use client';

import type React from 'react';
import { useSearchParams } from 'next/navigation';
import JobSearchForm from '@/components/common/JobSearchForm';

export default function JobSearchInterface() {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams?.get('q') || '';
  const initialLocation = searchParams?.get('location') || '';

  return (
    <div className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Find Jobs
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Discover opportunities that match your skills and career goals
          </p>
        </div>

        <JobSearchForm
          initialKeyword={initialKeyword}
          initialLocation={initialLocation}
          className="mb-3"
          preserveFilters={true}
          searchParams={searchParams}
        />

        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Popular: </span>
          <span>UI Designer, UX Researcher, Android, Admin</span>
        </div>
      </div>
    </div>
  );
}
