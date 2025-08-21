'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Job } from '@/types/Job';

interface SidebarProps {
  job: Job;
  isVipPackage: boolean;
  isPremiumPackage: boolean;
  getCurrentTopJob: () => React.ReactNode;
  getTopJobExpiryBadge: () => React.ReactNode;
  getVisibilityBadge: () => React.ReactNode;
  getVisibilityExpiryBadge: () => React.ReactNode;
  formatDate: (iso?: string) => string;
}

export function Sidebar({
  job,
  getCurrentTopJob,
  getTopJobExpiryBadge,
  getVisibilityBadge,
  getVisibilityExpiryBadge,
  formatDate,
}: SidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'}>
              {job.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deadline</span>
            <span className="font-medium">{formatDate(job.deadline)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Top Job Spotlight</span>
            <span className="font-medium">{getCurrentTopJob()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Top Job Expires</span>
            <span className="font-medium">{getTopJobExpiryBadge()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Visibility Package</span>
            {getVisibilityBadge()}
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Visibility Expires</span>
            <span className="font-medium">{getVisibilityExpiryBadge()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Job Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span className="text-sm">Featured on homepage</span>
          </div>
          <div className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span className="text-sm">Higher visibility to candidates</span>
          </div>
          <div className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span className="text-sm">
              Priority placement in search results
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span className="text-sm">Limited to 16 positions total</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
