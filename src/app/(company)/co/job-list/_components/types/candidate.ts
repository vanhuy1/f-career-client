export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  INTERVIEW = 'INTERVIEW',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  appliedDate: string;
  score: number;
  status: ApplicationStatus;
}
