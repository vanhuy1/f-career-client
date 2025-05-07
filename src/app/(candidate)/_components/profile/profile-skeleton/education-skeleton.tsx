'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EducationSectionSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Educations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8 flex gap-4 border-b pb-8">
          <div className="h-16 w-16 rounded-full bg-gray-200"></div>
          <div>
            <div className="mb-2 h-6 w-48 bg-gray-200"></div>
            <div className="mb-2 h-4 w-64 bg-gray-200"></div>
            <div className="mb-3 h-4 w-32 bg-gray-200"></div>
            <div className="h-4 w-full bg-gray-200"></div>
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200"></div>
          <div>
            <div className="mb-2 h-6 w-48 bg-gray-200"></div>
            <div className="mb-2 h-4 w-64 bg-gray-200"></div>
            <div className="mb-3 h-4 w-32 bg-gray-200"></div>
            <div className="h-4 w-full bg-gray-200"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
