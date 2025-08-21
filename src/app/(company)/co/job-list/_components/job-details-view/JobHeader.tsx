import { Edit, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { JobDetails } from '../types/job';
import { Job } from '@/types/Job';

interface JobHeaderProps {
  job: JobDetails;
  originalJob?: Job;
  onEditJobInfo?: () => void;
  onEditStatusDeadline?: () => void;
}

export function JobHeader({
  job,
  originalJob,
  onEditJobInfo,
  onEditStatusDeadline,
}: JobHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 shadow-xl backdrop-blur-sm">
        {/* Background pattern */}
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

        {/* Content */}
        <div className="relative">
          {/* Top Row - Logo and Title */}
          <div className="mb-4 flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 to-blue-100 p-1 shadow-lg ring-2 ring-white/50">
              {job.companyLogo ? (
                <Image
                  src={job.companyLogo}
                  alt={`${job.companyName} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-emerald-200 to-blue-200">
                  <span className="text-2xl font-bold text-emerald-700">
                    {job.companyName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-1 flex items-center gap-2 text-lg text-gray-600">
                <span>{job.companyName}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{job.location || 'Location not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-amber-500 bg-white text-amber-600 shadow-sm hover:border-amber-600 hover:bg-amber-50"
              onClick={() =>
                router.push(`/co/job-list/${originalJob?.id}/top-job`)
              }
              disabled={!originalJob}
            >
              <Star className="mr-2 h-4 w-4" />
              Top Positions
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 bg-white text-blue-600 shadow-sm hover:border-blue-700 hover:bg-blue-50"
              onClick={onEditJobInfo}
              disabled={!originalJob || !onEditJobInfo}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Job Info
            </Button>
            <Button
              variant="outline"
              className="border-purple-600 bg-white text-purple-600 shadow-sm hover:border-purple-700 hover:bg-purple-50"
              onClick={onEditStatusDeadline}
              disabled={!originalJob || !onEditStatusDeadline}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Status/Deadline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
