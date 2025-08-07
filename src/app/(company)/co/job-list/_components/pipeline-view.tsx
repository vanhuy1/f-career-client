import { MoreHorizontal } from 'lucide-react';
import { CandidateCard } from './candidate-card';
import type { Candidate } from '../_components/types/candidate';
import { ApplicationStatus } from '@/enums/applicationStatus';

interface PipelineViewProps {
  applicants: Candidate[];
  getScoreColor: (score: number) => string;
  getScoreBackgroundColor: (score: number) => string;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string }
> = {
  [ApplicationStatus.APPLIED]: {
    label: 'Applied',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
  },
  [ApplicationStatus.IN_REVIEW]: {
    label: 'In Review',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  [ApplicationStatus.SHORTED_LIST]: {
    label: 'Shortlisted',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  [ApplicationStatus.INTERVIEW]: {
    label: 'Interview',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  [ApplicationStatus.HIRED]: {
    label: 'Hired',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
  [ApplicationStatus.REJECTED]: {
    label: 'Rejected',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
  },
};

export function PipelineView({
  applicants,
  getScoreColor,
  getScoreBackgroundColor,
}: PipelineViewProps) {
  const applicantsByStatus = Object.values(ApplicationStatus).reduce<
    Record<string, Candidate[]>
  >(
    (acc, status) => {
      acc[status] = applicants.filter(
        (candidate) => candidate.status === status,
      );
      return acc;
    },
    {} as Record<string, Candidate[]>,
  );

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusApplicants = applicantsByStatus[status] || [];

        return (
          <div key={status} className="w-80 flex-shrink-0 space-y-4">
            <div className={`${config.bgColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${config.color}`} />
                  <span className="font-medium text-gray-900">
                    {config.label}
                  </span>
                  <span className="text-gray-600">
                    {statusApplicants.length}
                  </span>
                </div>
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-3">
              {statusApplicants.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  getScoreColor={getScoreColor}
                  getScoreBackgroundColor={getScoreBackgroundColor}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
