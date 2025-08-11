'use client';

import { Mail } from 'lucide-react';

interface ReadStatusLabelProps {
  isRead: boolean;
  className?: string;
}

export function ReadStatusLabel({
  isRead,
  className = '',
}: ReadStatusLabelProps) {
  if (isRead) {
    return null; // Don't show anything for read applications to keep UI clean
  }

  return (
    <div
      className={`absolute -top-4 -left-4 inline-flex animate-pulse items-center gap-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white shadow-lg ${className}`}
      title="Unread Application"
    >
      <Mail className="h-3 w-3" />
      <span className="font-medium">New!</span>
    </div>
  );
}
