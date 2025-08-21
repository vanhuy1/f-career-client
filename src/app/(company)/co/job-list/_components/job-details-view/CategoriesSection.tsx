import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import type { JobDetails } from '../types/job';

interface CategoriesSectionProps {
  job: JobDetails;
}

export function CategoriesSection({ job }: CategoriesSectionProps) {
  return (
    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
      <CardHeader className="rounded-t-lg bg-gradient-to-r from-orange-50 to-amber-50">
        <h2 className="text-xl font-bold text-gray-900">Categories</h2>
      </CardHeader>
      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          {job.categories.map((category, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={
                index === 0
                  ? 'border-orange-200 bg-orange-100 text-orange-700'
                  : 'border-amber-200 bg-amber-100 text-amber-700'
              }
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
