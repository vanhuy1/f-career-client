import { ApplicationStatus } from '@/enums/applicationStatus';

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  appliedDate: string;
  score: number;
  status: ApplicationStatus;
}
