'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ChecklistHeaderProps {
  onCreateNew: () => void;
}

export default function ChecklistHeader({ onCreateNew }: ChecklistHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CV Checklists</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your company&apos;s CV screening checklists for consistent
          candidate evaluation.
        </p>
      </div>
      <Button
        onClick={onCreateNew}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Checklist
      </Button>
    </div>
  );
}
