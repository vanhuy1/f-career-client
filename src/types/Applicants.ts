import { ApplicationStatus } from '@/enums/applicationStatus';

export interface ApplicantFilters {
  search: string;
  stage?: string;
  role?: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface Applicant {
  id: string;
  status: ApplicationStatus;
  applied_at: string;
  candidate: Candidate;
  job: Job;
}

export interface Candidate {
  id: string;
  name: string;
  avatar_url: string;
}

export interface Job {
  id: string;
  title: string;
}

// Changed from array to single object with data property
export interface Applicants {
  data: Applicant[];
  total?: number;
}
