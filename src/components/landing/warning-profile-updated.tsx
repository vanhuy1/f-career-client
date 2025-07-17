'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import ROUTES from '@/constants/navigation';

export const WarningProfileUpdated: React.FC = () => {
  return (
    <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                Complete your profile to unlock all features and improve your
                job matching
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={ROUTES.CA.HOME.PROFILE.path}
              className="inline-flex items-center space-x-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-amber-700 hover:shadow-md"
            >
              <span>Update Profile</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningProfileUpdated;
