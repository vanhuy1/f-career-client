'use client';

import { useState, useEffect } from 'react';
import { Share2, Bookmark, CheckCircle2 } from 'lucide-react';
import ApplyJobButton from '@/app/(public)/_components/apply-job-button';
import { useUser } from '@/services/state/userSlice';
import { ROLES } from '@/enums/roles.enum';
import { bookmarkJobService } from '@/services/api/bookmark/bookmark-job.api';
import { toast } from 'react-toastify';
import { jobService } from '@/services/api/jobs/job-api';

interface JobHeaderProps {
  companyName: string;
  jobTitle: string;
  location: string;
  jobType: string;
  jobId: string;
  isBookmarked?: boolean;
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export default function JobHeader({
  companyName,
  jobTitle,
  location,
  jobType,
  jobId,
  isBookmarked = false,
  onBookmarkChange,
}: JobHeaderProps) {
  const user = useUser();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isApplied, setIsApplied] = useState<boolean | null>(null);
  const [isAppliedLoading, setIsAppliedLoading] = useState<boolean>(false);
  const logoLetter = companyName.charAt(0).toUpperCase();

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark jobs');
      return;
    }

    if (isBookmarkLoading) return;

    setIsBookmarkLoading(true);
    try {
      const response = await bookmarkJobService.toggleBookmarkJob(jobId);
      setBookmarked(response.bookmarked);
      onBookmarkChange?.(response.bookmarked);
    } catch (error) {
      console.error('Bookmark toggle error:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  // Sync local state with prop changes
  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  // Check whether current user has already applied
  useEffect(() => {
    const checkApplied = async () => {
      if (!user || !jobId) {
        setIsApplied(null);
        return;
      }
      setIsAppliedLoading(true);
      try {
        const result = await jobService.checkIsApplied(jobId);
        setIsApplied(result.isApply);
        console.log(result);
      } catch (error) {
        // Silently ignore and allow applying
        setIsApplied(null);
        console.error('Failed to check apply status:', error);
      } finally {
        setIsAppliedLoading(false);
      }
    };

    checkApplied();
  }, [user, jobId]);

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
        <button
          onClick={handleBookmarkToggle}
          disabled={isBookmarkLoading}
          className={`rounded-full p-2 transition-colors ${
            bookmarked
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'text-gray-500 hover:bg-gray-100'
          } ${isBookmarkLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Share2 className="h-5 w-5 text-gray-500" />
        </button>
        {(user?.data.roles[0] === ROLES.USER || !user) &&
          (isAppliedLoading ? (
            <button
              disabled
              className="cursor-not-allowed rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500"
            >
              Checking...
            </button>
          ) : isApplied ? (
            <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
            </span>
          ) : (
            <ApplyJobButton
              jobTitle={jobTitle}
              company={companyName}
              location={location}
              jobType={jobType}
              jobId={jobId!}
            />
          ))}
      </div>
    </div>
  );
}
