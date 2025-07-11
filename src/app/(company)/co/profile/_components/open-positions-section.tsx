'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { OpenPositionsJob } from '@/types/Job';
import { useState } from 'react';

interface OpenPositionsSectionProps {
  companyJob: OpenPositionsJob[];
}

export default function OpenPositionsSection({
  companyJob,
}: OpenPositionsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  // If no jobs data, return null
  if (!companyJob) {
    return null;
  }

  // Filter jobs to only show those with "OPEN" status
  const openJobs = companyJob.filter((job) => job.status === 'OPEN');

  const hasMoreThanFive = openJobs.length > 5;
  const displayedJobs = showAll ? openJobs : openJobs.slice(0, 5);

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
        {openJobs.length > 0 ? (
          <>
            {displayedJobs.map((job) => (
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
            ))}
            {hasMoreThanFive && (
              <div className="border-t p-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowAll(!showAll)}
                  className="text-indigo-700 hover:bg-indigo-50"
                >
                  {showAll ? (
                    <>
                      Show Less
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See More ({openJobs.length - 5} more positions)
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="p-5 text-center">
            <p className="text-gray-500">No open positions at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
