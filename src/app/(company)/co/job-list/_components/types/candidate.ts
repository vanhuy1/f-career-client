import { ApplicationStatus } from '@/enums/applicationStatus';

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  appliedDate: string;
  score: number;
  status: ApplicationStatus;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  isRead: boolean;
}
