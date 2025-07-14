import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Candidate } from '../_components/types/candidate';
import { useRouter } from 'next/navigation';

interface TableViewProps {
  applicants: Candidate[];
  getScoreColor: (score: number) => string;
  getScoreBackgroundColor: (score: number) => string;
}

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
        {applicants.map((candidate) => (
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
              <Badge variant="secondary" className="capitalize">
                {candidate.status.toLowerCase()}
              </Badge>
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
        ))}
      </TableBody>
    </Table>
  );
}
