import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ExperienceSectionSkeleton() {
  // Display two skeleton items by default
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Experiences</CardTitle>
        <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
      </CardHeader>
      <CardContent>
        {/* First experience skeleton */}
        <div className="relative mb-8 border-b pb-8">
          <div className="absolute top-0 right-0 h-8 w-8 animate-pulse rounded-md bg-gray-200" />
          <div className="flex gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 animate-pulse items-center justify-center overflow-hidden rounded-full border bg-gray-200" />
            <div className="w-full">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mb-3 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Second experience skeleton */}
        <div className="relative mb-4">
          <div className="absolute top-0 right-0 h-8 w-8 animate-pulse rounded-md bg-gray-200" />
          <div className="flex gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 animate-pulse items-center justify-center overflow-hidden rounded-full border bg-gray-200" />
            <div className="w-full">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mb-3 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Show more button skeleton */}
        <div className="mt-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
      </CardContent>
    </Card>
  );
}
