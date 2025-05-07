import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Instagram, Twitter, Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function SocialSectionSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-6 w-32" />
        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
          <Edit2 className="h-4 w-4 text-gray-300" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Instagram className="h-5 w-5 text-gray-200" />
            </div>
            <div className="w-full">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-5 w-full max-w-[200px]" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Twitter className="h-5 w-5 text-gray-200" />
            </div>
            <div className="w-full">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-5 w-full max-w-[200px]" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Globe className="h-5 w-5 text-gray-200" />
            </div>
            <div className="w-full">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-5 w-full max-w-[200px]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
