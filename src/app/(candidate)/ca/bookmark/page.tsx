'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Heart, Search, Frown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { bookmarkJobService } from '@/services/api/bookmark/bookmark-job.api';
import { MyBookmarkedJob } from '@/types/JobBookMark';
import { employmentType } from '@/enums/employmentType';
import { Clock, Eye } from 'lucide-react';

// Map the incoming string to the enum value
function getEmploymentTypeLabel(type: string): string {
  const normalized = type.replace(/[\s_-]/g, '').toLowerCase();

  // Check both keys and values of the enum
  for (const key of Object.keys(employmentType) as Array<
    keyof typeof employmentType
  >) {
    const enumValue = employmentType[key];
    if (
      key.replace(/[\s_-]/g, '').toLowerCase() === normalized ||
      enumValue.replace(/[\s_-]/g, '').toLowerCase() === normalized
    ) {
      return enumValue;
    }
  }
  // fallback to original string if not found
  return type;
}

interface BookmarkedJobCardProps {
  bookmarkedJob: MyBookmarkedJob;
}

function BookmarkedJobCard({ bookmarkedJob }: BookmarkedJobCardProps) {
  const router = useRouter();
  const { job } = bookmarkedJob;

  // Map typeOfEmployment to badge style
  const getTypeBadge = (t: string) => {
    const normalized = t.replace(/[\s_-]/g, '').toLowerCase();
    switch (normalized) {
      case 'fulltime':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'parttime':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'contract':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Map category.name to badge style
  const getCategoryBadge = () => {
    switch (job.category.name) {
      case 'Technology':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Management':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Design':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Data Science':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Marketing':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCardClick = () => {
    router.push(`/job/${job.id}`);
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/job/${job.id}`);
  };

  return (
    <div className="group w-full">
      <div
        className="w-full cursor-pointer overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        onClick={handleCardClick}
      >
        <div className="relative w-full">
          {bookmarkedJob.isApply && (
            <div className="absolute top-0 left-0">
              <Badge className="z-10 rounded-none rounded-br-lg bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                ✓ Applied
              </Badge>
            </div>
          )}

          <div className="flex p-3">
            <div className="mr-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={job.company.logoUrl || '/placeholder.svg'}
                  alt={`${job.company.companyName} logo`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate text-sm font-semibold text-gray-800"
                  title={job.title}
                >
                  {job.title}
                </h3>
                <p className="truncate text-xs text-gray-600">
                  {job.company.companyName} • {job.location}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getTypeBadge(job.typeOfEmployment)}`}
                  >
                    {getEmploymentTypeLabel(job.typeOfEmployment)}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getCategoryBadge()}`}
                  >
                    {job.category.name}
                  </span>
                </div>
              </div>

              <div className="ml-3 flex flex-col items-end justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <Bookmark className="h-3 w-3" />
                  <span>
                    {new Date(bookmarkedJob.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDetailClick}
                  className="h-6 border-gray-300 px-2 py-1 text-xs text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookmarkPage() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<MyBookmarkedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await bookmarkJobService.getMyBookmarkedJobs();
        const data = response as unknown;
        const jobs = Array.isArray(data)
          ? (data as MyBookmarkedJob[])
          : ((data as { jobs?: MyBookmarkedJob[] }).jobs ?? []);
        setBookmarkedJobs(jobs);
      } catch (err) {
        setError('Failed to load bookmarked jobs. Please try again.');
        console.error('Error fetching bookmarked jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full justify-center bg-gray-50/50">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50/50">
      <main className="w-[95%] max-w-7xl p-6">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-gray-900">
              <Heart className="h-8 w-8 fill-current text-pink-500" />
              My Bookmarked Jobs
            </h1>
            <p className="text-gray-600">
              Jobs you&apos;ve saved for later review. Keep track of
              opportunities that interest you.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-pink-200 bg-pink-50 px-3 py-1 text-pink-700"
            >
              <Bookmark className="h-4 w-4" />
              {bookmarkedJobs.length} Saved
            </Badge>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs Grid */}
        {bookmarkedJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
            {bookmarkedJobs.map((bookmarkedJob) => (
              <BookmarkedJobCard
                key={bookmarkedJob.id}
                bookmarkedJob={bookmarkedJob}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Frown className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No bookmarked jobs yet
                </h3>
                <p className="mx-auto mb-6 max-w-md text-gray-600">
                  Start exploring jobs and bookmark the ones that interest you.
                  You can easily access them later from this page.
                </p>
                <Button
                  onClick={() => (window.location.href = '/job')}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Browse Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
