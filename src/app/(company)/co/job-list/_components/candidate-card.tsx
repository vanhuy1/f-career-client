import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Candidate } from '../_components/types/candidate';
import { ApplicationStatus } from '../_components/types/candidate';

interface CandidateCardProps {
  candidate: Candidate;
}

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: '#f97316',
  [ApplicationStatus.INTERVIEW]: '#3b82f6',
  [ApplicationStatus.HIRED]: '#10b981',
  [ApplicationStatus.REJECTED]: '#ef4444',
};

export function CandidateCard({ candidate }: CandidateCardProps) {
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
            <Button variant="link" className="h-auto p-0 text-sm text-blue-600">
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
            <div>Score</div>
            <div className="flex items-center gap-1">
              <Star
                className={`h-4 w-4 ${candidate.score > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
              <span className="font-medium text-gray-900">
                {candidate.score.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
