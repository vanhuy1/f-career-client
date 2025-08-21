'use client';

import { Button } from '@/components/ui/button';
import { X, Eye, Sparkles } from 'lucide-react';
import { JobPreviewCard, mockPreviewJobs } from './JobPreviewCard';

interface JobListPreviewProps {
  packageType: 'vip' | 'premium' | 'basic' | null;
  showPreview: boolean;
  onClose: () => void;
  currentJobTitle: string;
}

export function JobListPreview({
  packageType,
  showPreview,
  onClose,
}: JobListPreviewProps) {
  if (!packageType || !showPreview) return null;

  const getHighlightedPositions = (packageId: 'vip' | 'premium' | 'basic') => {
    switch (packageId) {
      case 'vip':
        return [1];
      case 'premium':
        return [2];
      case 'basic':
        return [3];
      default:
        return [];
    }
  };

  const getPositionText = (packageId: 'vip' | 'premium' | 'basic') => {
    switch (packageId) {
      case 'vip':
        return 'Your job will dominate the top of search results with maximum visibility';
      case 'premium':
        return 'Your job will be prominently highlighted and appear above standard listings';
      case 'basic':
        return 'Your job will appear in standard positions in search results';
      default:
        return '';
    }
  };

  const getPackageColor = (packageId: 'vip' | 'premium' | 'basic') => {
    switch (packageId) {
      case 'vip':
        return 'from-purple-600 via-pink-600 to-orange-500';
      case 'premium':
        return 'from-indigo-600 to-purple-600';
      case 'basic':
        return 'from-gray-600 to-gray-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-[700px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full bg-gradient-to-r ${getPackageColor(packageType)} p-3 text-white shadow-lg`}
              >
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Live Preview: {packageType.toUpperCase()} Package
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {getPositionText(packageType)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-2.5 shadow-sm transition-colors hover:bg-gray-200"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6 pt-6">
          {mockPreviewJobs.slice(0, 5).map((job, index) => {
            const position = index + 1;
            const isHighlighted =
              getHighlightedPositions(packageType).includes(position);

            return (
              <JobPreviewCard
                key={job.id}
                job={job}
                position={position}
                packageType={isHighlighted ? packageType : null}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </div>

        <div className="sticky bottom-0 border-t bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 p-4 text-indigo-800">
            <Sparkles className="h-6 w-6 flex-shrink-0 text-indigo-600" />
            <p className="text-sm font-medium">
              <span className="font-bold">Premium positions</span> receive up to
              10x more visibility and 5x more applications than basic listings
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              size="lg"
              variant="default"
              onClick={onClose}
              className={`bg-gradient-to-r ${getPackageColor(packageType)} px-8 shadow-lg hover:opacity-90`}
            >
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
