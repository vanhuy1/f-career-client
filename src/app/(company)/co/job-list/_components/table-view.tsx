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
}

export function TableView({ applicants }: TableViewProps) {
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
          <TableHead>Score</TableHead>
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
              <div className="flex items-center gap-1">
                <Star
                  className={`h-4 w-4 ${candidate.score > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
                <span>{candidate.score.toFixed(1)}</span>
              </div>
            </TableCell>
            <TableCell>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleViewProfile(candidate.id)}
              >
                View Profile {candidate.id}
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
