'use client';

import { Share2 } from 'lucide-react';
import ApplyJobButton from '@/app/(public)/_components/apply-job-button';
import { useUser } from '@/services/state/userSlice';
import { ROLES } from '@/enums/roles.enum';

interface JobHeaderProps {
  companyName: string;
  jobTitle: string;
  location: string;
  jobType: string;
  jobId?: string; // Optional, if needed for ApplyJobButton
}

export default function JobHeader({
  companyName,
  jobTitle,
  location,
  jobType,
  jobId, // Optional, if needed for ApplyJobButton
}: JobHeaderProps) {
  const user = useUser();
  const logoLetter = companyName.charAt(0).toUpperCase();
  return (
    <div className="mb-8 flex items-center justify-between rounded-lg border p-6">
      <div className="flex items-center">
        <div className="mr-6 flex h-20 w-20 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-indigo-400 text-5xl font-bold text-white">
          {logoLetter}
        </div>
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">{jobTitle}</h1>
          <div className="text-gray-600">
            {companyName} <span className="mx-2"> • </span> {location}{' '}
            <span className="mx-2">•</span> {jobType}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Share2 className="h-5 w-5 text-gray-500" />
        </button>
        {(user?.data.roles[0] === ROLES.USER || !user) && (
          <ApplyJobButton
            jobTitle={jobTitle}
            company={companyName}
            location={location}
            jobType={jobType}
            jobId={jobId}
          />
        )}
      </div>
    </div>
  );
}
