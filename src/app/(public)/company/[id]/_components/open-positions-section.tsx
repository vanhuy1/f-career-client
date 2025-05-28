'use client';

import { OpenPositionsJob } from '@/types/Job';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface OpenPositionsSectionProps {
  companyJob: OpenPositionsJob[];
}

export default function OpenPositionsSection({
  companyJob,
}: OpenPositionsSectionProps) {
  if (!companyJob || companyJob.length === 0) return null;

  return (
    <div className="rounded-lg border-b border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold">Open Positions</h2>
      <div className="rounded-lg border bg-white">
        {companyJob.map((job, index) => (
          <div
            key={index}
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
      </div>
    </div>
  );
}
