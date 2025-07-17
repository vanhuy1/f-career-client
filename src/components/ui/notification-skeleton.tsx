import { Skeleton } from '@/components/ui/skeleton';

export function NotificationSkeleton() {
  return (
    <div className="border-b p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="mt-1 h-2 w-2 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function NotificationsDropdownSkeleton() {
  return (
    <div className="w-80 p-0">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <NotificationSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
