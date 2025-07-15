'use client';

import { OpenPositionsJob } from '@/types/Job';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Briefcase, MapPin, Users } from 'lucide-react';

interface OpenPositionsSectionProps {
  companyJob: OpenPositionsJob[];
}

export default function OpenPositionsSection({
  companyJob,
}: OpenPositionsSectionProps) {
  if (!companyJob || companyJob.length === 0) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-green-50 to-emerald-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute right-0 bottom-0 h-40 w-40 translate-x-20 translate-y-20 rounded-full bg-gradient-to-tl from-green-100 to-emerald-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-8 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
          <p className="mt-1 text-sm text-gray-600">Join our growing team</p>
        </div>
      </div>

      {/* Job Cards */}
      <div className="relative space-y-4">
        {companyJob.map((job, index) => (
          <div
            key={index}
            className="group/job relative overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Card background decoration */}
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 opacity-50 transition-transform duration-500 group-hover/job:scale-110"></div>

            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              {/* Job Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2 shadow-md">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover/job:text-green-600">
                      {job.title}
                    </h3>

                    {/* Job details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>

                      {/* Additional job info could go here */}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>Full-time</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <Link href={`/job/${job.id}`}>
                  <Button
                    variant="outline"
                    className="group/btn relative overflow-hidden border-green-200 bg-white/80 px-6 py-2 font-semibold text-green-700 transition-all duration-300 hover:border-green-300 hover:bg-green-50 hover:text-green-800"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      View Position
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>

                    {/* Button background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover/job:opacity-100"></div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="relative mt-6 rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
        <div className="text-center">
          <p className="text-sm font-medium text-green-700">
            {companyJob.length} open position{companyJob.length > 1 ? 's' : ''}{' '}
            available
          </p>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
    </div>
  );
}
