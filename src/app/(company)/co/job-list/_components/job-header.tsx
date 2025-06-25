'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function JobHeader() {
  const router = useRouter();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Social Media Assistant
          </h1>
          <p className="text-gray-600">Design • Full-Time • 4 / 11 Hired</p>
        </div>
      </div>
    </div>
  );
}
