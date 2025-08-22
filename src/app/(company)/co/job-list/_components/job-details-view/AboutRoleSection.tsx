import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import type { JobDetails } from '../types/job';
import { formatEmploymentType } from '@/utils/formatters';

interface AboutRoleSectionProps {
  job: JobDetails;
  applicantsCount?: number;
}

export function AboutRoleSection({
  job,
  applicantsCount,
}: AboutRoleSectionProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-purple-50 to-pink-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3 shadow-lg">
          <Briefcase className="h-6 w-6 text-lg font-bold text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About This Job</h2>
        </div>
      </div>

      {/* Content */}
      <div className="relative space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600">Applicants</span>
          <span className="text-2xl font-bold text-pink-600">
            {applicantsCount && applicantsCount > 0
              ? applicantsCount <= 10
                ? applicantsCount
                : '10+'
              : 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deadline</span>
          <span className="font-medium text-gray-900">{job.applyBefore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Created at</span>
          <span className="font-medium text-gray-900">{job.postedOn}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Job Type</span>
          <span className="font-medium text-gray-900">
            {formatEmploymentType(job.type)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Experience</span>
          <span className="font-medium text-gray-900">
            {job.experienceYears} years +
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status</span>
          <Badge
            variant={job.status === 'OPEN' ? 'default' : 'destructive'}
            className={
              job.status === 'OPEN'
                ? 'border-pink-200 bg-pink-100 text-red-800'
                : ''
            }
          >
            {job.status}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Salary</span>
          <span className="font-medium text-gray-900">{job.salary}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Categories</span>
          <div className="flex gap-2">
            {job.categories.map((category, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={
                  index === 0
                    ? 'border-orange-200 bg-orange-100 text-orange-700'
                    : 'border-amber-200 bg-amber-100 text-amber-700'
                }
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
    </div>
  );
}
