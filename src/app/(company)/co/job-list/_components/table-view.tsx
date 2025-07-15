import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import type { Candidate } from '../_components/types/candidate';
import { useRouter } from 'next/navigation';
import { ApplicationStatus } from '@/enums/applicationStatus';

interface TableViewProps {
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

export function TableView({
  applicants,
  getScoreColor,
  getScoreBackgroundColor,
}: TableViewProps) {
  const router = useRouter();

  const handleViewProfile = (candidateId: string) => {
    router.push(`/co/applicant-list/${candidateId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied Date</TableHead>
          <TableHead>AI Score</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants.map((candidate) => {
          const statusInfo = statusConfig[candidate.status];

          return (
            <TableRow key={candidate.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={candidate.avatar || '/placeholder.svg'}
                      alt={candidate.name}
                    />
                    <AvatarFallback>
                      {candidate.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{candidate.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${statusInfo.bgColor}`}
                >
                  <div className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
                  <span className="text-sm font-medium text-gray-900">
                    {statusInfo.label}
                  </span>
                </div>
              </TableCell>
              <TableCell>{candidate.appliedDate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-1 ${getScoreBackgroundColor(candidate.score)}`}
                  >
                    <Star
                      className={`h-4 w-4 ${candidate.score > 0 ? `fill-current ${getScoreColor(candidate.score)}` : 'text-gray-300'}`}
                    />
                    <span
                      className={`font-semibold ${getScoreColor(candidate.score)}`}
                    >
                      {candidate.score}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleViewProfile(candidate.id)}
                >
                  View Profile
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
