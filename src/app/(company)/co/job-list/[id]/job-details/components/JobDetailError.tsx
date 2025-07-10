import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface JobDetailErrorProps {
  error: string;
  onRetry?: () => void;
}

export default function JobDetailError({
  error,
  onRetry,
}: JobDetailErrorProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h3 className="text-lg font-semibold">Failed to Load Job Details</h3>
          <p className="text-center text-sm text-gray-600">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} className="mt-4">
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
