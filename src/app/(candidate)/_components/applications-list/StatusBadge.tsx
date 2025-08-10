'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/enums/applicationStatus';

type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
  'aria-label'?: string;
};

const STYLES: Record<
  ApplicationStatus,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  APPLIED: {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    label: 'Applied',
  },
  IN_REVIEW: {
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    label: 'In review',
  },
  SHORTED_LIST: {
    bg: 'bg-violet-100',
    text: 'text-violet-900',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    label: 'Shortlisted',
  },
  INTERVIEW: {
    bg: 'bg-purple-100',
    text: 'text-purple-900',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    label: 'Interviewing',
  },
  HIRED: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Hired',
  },
  REJECTED: {
    bg: 'bg-rose-100',
    text: 'text-rose-900',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    label: 'Rejected',
  },
};

export default function StatusBadge({
  status,
  className,
  ...props
}: StatusBadgeProps) {
  const s = STYLES[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        s.bg,
        s.text,
        s.border,
        className,
      )}
      {...props}
      aria-label={props['aria-label'] ?? s.label}
    >
      <span
        aria-hidden="true"
        className={cn('h-1.5 w-1.5 rounded-full', s.dot)}
      />
      <span>{s.label}</span>
    </Badge>
  );
}
