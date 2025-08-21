import { Gift } from 'lucide-react';
import type { JobDetails } from '../types/job';

interface BenefitsSectionProps {
  job: JobDetails;
}

export function BenefitsSection({ job }: BenefitsSectionProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-green-50 to-emerald-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute right-0 bottom-0 h-40 w-40 translate-x-20 translate-y-20 rounded-full bg-gradient-to-tl from-green-100 to-emerald-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg">
          <Gift className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Benefits & Perks</h2>
          <p className="mt-1 text-sm text-gray-600">
            What you&apos;ll get when you join us
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative space-y-4">
        {job.niceToHaves.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-lg text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
    </div>
  );
}
