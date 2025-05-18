'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OpenPositionsJob } from '@/types/Job';

interface OpenPositionsSectionProps {
  companyJob: OpenPositionsJob[];
}

export default function OpenPositionsSection({
  companyJob,
}: OpenPositionsSectionProps) {
  // If no jobs data, return null
  if (!companyJob) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Open Positions</h2>
        <Link href="/co/post-job">
          <Button size="sm" className="bg-indigo-700 hover:bg-violet-500">
            Post a Job
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border bg-white">
        {companyJob.length > 0 ? (
          companyJob.map((job) => (
            <div
              key={job.id}
              className="flex flex-wrap items-center justify-between border-b p-5 last:border-0"
            >
              <div className="max-w-2xl">
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.location}</p>
              </div>
              <div className="mt-2 flex md:mt-0">
                <Link href={`/job/${job.id}`}>
                  <Button
                    variant="outline"
                    className="group font-medium text-indigo-700"
                  >
                    View Position
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-5 text-center">
            <p className="text-gray-500">No open positions at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
