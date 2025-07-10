import { Card, CardHeader } from '@/components/ui/card';

export default function JobDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Description */}
          <div>
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* About this role */}
          <div>
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="space-y-4">
              <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-4 h-6 w-24 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-6 w-16 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
