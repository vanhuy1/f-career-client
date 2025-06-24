import type { ApplicationStatus } from '@/types/Application';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'INTERVIEW':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'HIRED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED':
        return 'Applied';
      case 'INTERVIEW':
        return 'Interviewing';
      case 'HIRED':
        return 'Hired';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyles(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
