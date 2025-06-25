import { MoreHorizontal } from 'lucide-react';
import { CandidateCard } from './candidate-card';
import type { Candidate } from '../_components/types/candidate';
import { ApplicationStatus } from '../_components/types/candidate';

interface PipelineViewProps {
  applicants: Candidate[];
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; count: number; color: string; bgColor: string }
> = {
  [ApplicationStatus.APPLIED]: {
    label: 'Applied',
    count: 10,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
  },
  [ApplicationStatus.INTERVIEW]: {
    label: 'Interview',
    count: 11,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  [ApplicationStatus.HIRED]: {
    label: 'Hired',
    count: 3,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
  [ApplicationStatus.REJECTED]: {
    label: 'Rejected',
    count: 5,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
  },
};

export function PipelineView({ applicants }: PipelineViewProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {Object.entries(statusConfig).map(([status, config]) => (
        <div key={status} className="space-y-4">
          <div className={`${config.bgColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${config.color}`} />
                <span className="font-medium text-gray-900">
                  {config.label}
                </span>
                <span className="text-gray-600">{config.count}</span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-3">
            {applicants
              .filter((candidate) => candidate.status === status)
              .map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
