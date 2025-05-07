import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Languages } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ContactSectionSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Additional Details</CardTitle>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Mail className="h-5 w-5" />
            </div>
            <div className="w-full">
              <p className="mb-1 text-gray-500">Email</p>
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Phone className="h-5 w-5" />
            </div>
            <div className="w-full">
              <p className="mb-1 text-gray-500">Phone</p>
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-400">
              <Languages className="h-5 w-5" />
            </div>
            <div className="w-full">
              <p className="mb-1 text-gray-500">Languages</p>
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
