'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SkeletonAboutSection() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          <div className="bg-muted h-6 w-24 animate-pulse rounded-md" />
        </CardTitle>
        <div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted h-4 w-full animate-pulse rounded-md" />
          <div className="bg-muted h-4 w-full animate-pulse rounded-md" />
          <div className="bg-muted h-4 w-3/4 animate-pulse rounded-md" />
          <div className="bg-muted h-4 w-full animate-pulse rounded-md" />
          <div className="bg-muted h-4 w-5/6 animate-pulse rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
