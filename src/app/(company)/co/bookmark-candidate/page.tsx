'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { candidateBookmarkService } from '@/services/api/bookmark/bookmark-candidate.api';
import type { CandidateBookmark } from '@/types/CandidateBookmark';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookmarkCheck,
  Calendar,
  Check,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export default function BookmarkedCandidatesPage() {
  const [bookmarks, setBookmarks] = useState<CandidateBookmark[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');

  const PAGE_SIZE = 12;

  const fetchBookmarks = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      const response = await candidateBookmarkService.getMyBookmarkedCandidates(
        {
          limit: PAGE_SIZE,
          offset: loadMore ? offset : 0,
        },
      );

      const newItems = response?.bookmarks ?? [];
      if (loadMore) {
        setBookmarks((prev) => [...prev, ...newItems]);
      } else {
        setBookmarks(newItems);
      }

      const nextOffset = (loadMore ? offset : 0) + newItems.length;
      setOffset(nextOffset);
      setHasMore(newItems.length === PAGE_SIZE);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBookmarks(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookmarks;
    return bookmarks.filter((b) => {
      const name = b.candidateProfile.user.name?.toLowerCase() ?? '';
      const title = b.candidateProfile.title?.toLowerCase() ?? '';
      const location = b.candidateProfile.location?.toLowerCase() ?? '';
      return name.includes(q) || title.includes(q) || location.includes(q);
    });
  }, [bookmarks, query]);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200/60 bg-white/80 px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Potential Candidates
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review and manage the candidates your team bookmarked
            </p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, title, or location"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-44 animate-pulse rounded-xl border border-gray-200/60 bg-gray-50"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200/60 bg-white p-12 text-center">
            <BookmarkCheck className="mb-3 h-8 w-8 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              No bookmarked candidates yet
            </h3>
            <p className="mt-1 max-w-md text-sm text-gray-500">
              Bookmark candidates from their application pages to quickly build
              your talent pipeline.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {filtered.length}{' '}
              {filtered.length === 1 ? 'candidate' : 'candidates'}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filtered.map((b) => (
                <HoverCard key={b.id}>
                  <HoverCardTrigger asChild>
                    <Link
                      href={`/co/candidate/${b.candidateProfile.id}`}
                      className="group flex items-center gap-6 overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm shadow-gray-100/50 transition-all hover:shadow-md"
                    >
                      <Image
                        src={
                          b.candidateProfile.user.avatar ||
                          '/placeholder.svg?height=80&width=80'
                        }
                        alt={b.candidateProfile.user.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover ring-4 ring-white"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-gray-900">
                          {b.candidateProfile.user.name}
                        </h3>
                        <div className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                          {b.candidateProfile.title ?? 'Candidate'}
                        </div>
                      </div>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" side="top" className="w-80">
                    <div className="flex items-start gap-4">
                      <Image
                        src={
                          b.candidateProfile.user.avatar ||
                          '/placeholder.svg?height=48&width=48'
                        }
                        alt={b.candidateProfile.user.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {b.candidateProfile.user.name}
                        </div>
                        <div className="mt-1 truncate text-sm text-gray-600">
                          {b.candidateProfile.title ?? 'Candidate'}
                        </div>
                        {b.candidateProfile.location ? (
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">
                              {b.candidateProfile.location}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">
                              Location not specified
                            </span>
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {b.candidateProfile.isOpenToOpportunities ? (
                            <Badge className="flex w-fit items-center gap-1.5 border-0 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              Open to opportunities
                            </Badge>
                          ) : (
                            <Badge className="flex w-fit items-center gap-1.5 border-0 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
                              <X className="h-3.5 w-3.5 text-red-500" />
                              Not open to opportunities
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Bookmarked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => fetchBookmarks(true)}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading...' : 'Load more'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
