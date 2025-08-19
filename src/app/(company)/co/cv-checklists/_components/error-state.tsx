'use client';

import { AlertTriangle } from 'lucide-react';

export default function ErrorState() {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <p className="text-sm text-red-800">Unable to load checklists</p>
      </div>
    </div>
  );
}
