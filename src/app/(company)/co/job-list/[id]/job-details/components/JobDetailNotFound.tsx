import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function JobDetailNotFound() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <FileX className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-semibold">Job Not Found</h3>
          <p className="text-center text-sm text-gray-600">
            The job you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/co/job-list">
            <Button className="mt-4">Back to Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
