import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Candidate } from '../_components/types/candidate';
import { ApplicationStatus } from '@/enums/applicationStatus';
import { useRouter } from 'next/navigation';

interface CandidateCardProps {
  candidate: Candidate;
  getScoreColor: (score: number) => string;
  getScoreBackgroundColor: (score: number) => string;
}

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: '#f97316',
  [ApplicationStatus.IN_REVIEW]: '#3b82f6',
  [ApplicationStatus.SHORTED_LIST]: '#8b5cf6',
  [ApplicationStatus.INTERVIEW]: '#3b82f6',
  [ApplicationStatus.HIRED]: '#10b981',
  [ApplicationStatus.REJECTED]: '#ef4444',
};

export function CandidateCard({
  candidate,
  getScoreColor,
  getScoreBackgroundColor,
}: CandidateCardProps) {
  const router = useRouter();

  const handleViewProfile = (candidateId: string) => {
    router.push(`/co/applicant-list/${candidateId}`);
  };
  return (
    <Card
      className="mb-4 border-l-4"
      style={{ borderLeftColor: statusColors[candidate.status] }}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-12 w-12">
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
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-blue-600"
              onClick={() => handleViewProfile(candidate.id)}
            >
              View Profile
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            <div>Applied on</div>
            <div className="font-medium text-gray-900">
              {candidate.appliedDate}
            </div>
          </div>
          <div className="text-right">
            <div>AI Score</div>
            <div
              className={`flex items-center gap-1 rounded-md px-2 py-1 ${getScoreBackgroundColor(candidate.score)}`}
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
        </div>
      </CardContent>
    </Card>
  );
}
