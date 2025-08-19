'use client';

import { Button } from '@/components/ui/button';
import { ClipboardCheck, Plus, FileText } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

export default function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
          <ClipboardCheck className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Using Default System Template
        </h3>
        <p className="mb-6 text-gray-600">
          Your company is currently using our default CV screening checklist.
          Create a custom checklist to tailor the screening process to your
          specific needs.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Checklist
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FileText className="mr-2 h-4 w-4" />
            View Default Template
          </Button>
        </div>
      </div>
    </div>
  );
}
