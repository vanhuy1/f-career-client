import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/enums/applicationStatus';
import StatusBadge from './StatusBadge';

interface FilterableStatusBadgeProps {
  status: ApplicationStatus;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export default function FilterableStatusBadge({
  status,
  isActive,
  onClick,
  count,
}: FilterableStatusBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded transition-all focus:outline-none',
        isActive ? 'ring-2 ring-blue-400 ring-offset-1' : 'hover:opacity-80',
      )}
    >
      <StatusBadge status={status} />
      {count !== undefined && (
        <span className="ml-1 text-xs font-medium text-gray-700">
          ({count})
        </span>
      )}
    </button>
  );
}
