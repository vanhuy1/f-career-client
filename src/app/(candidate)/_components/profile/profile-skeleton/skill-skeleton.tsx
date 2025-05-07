import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SkillsSectionSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="bg-muted h-6 w-24 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
          <div className="bg-muted h-8 w-8 animate-pulse rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-muted h-8 w-20 animate-pulse rounded-full"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
