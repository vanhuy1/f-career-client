'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface JobListHeaderProps {
  companyName: string;
}

export default function JobListHeader({ companyName }: JobListHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job Listing</h1>
          <p className="mt-1 text-sm text-gray-600">
            Managing jobs for {companyName}
          </p>
        </div>
        <Button
          onClick={() => router.push('/co/post-job')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Post New Job
        </Button>
      </div>
    </div>
  );
}
