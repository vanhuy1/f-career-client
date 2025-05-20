'use client';

import { X } from 'lucide-react';

interface NewFeatureAlertProps {
  onClose: () => void;
}

export default function NewFeatureAlert({ onClose }: NewFeatureAlertProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-blue-50 p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8V12"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16H12.01"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-blue-700">New Feature</h3>
        <p className="mt-1 text-blue-600">
          You can request a follow-up 7 days after applying for a job if the
          application status is in review. Only one follow-up is allowed per
          job.
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-blue-500 hover:text-blue-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
