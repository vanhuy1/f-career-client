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

export interface ApplicantDetail {
  id: number;
  status: ApplicationStatus;
  cv_id: string;
  cover_letter: string;
  applied_at: string;
  updated_at: string;
  ai_status?: string;
  ai_score?: number;
  ai_analysis?: string;
  candidate: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string;
    gender: string | null;
  };
  candidateProfile: {
    id: string;
    title: string;
    company: string | null;
    location: string;
    avatar: string | null;
    coverImage: string | null;
    isOpenToOpportunities: boolean;
    about: string | null;
    contact: string | null;
    social: string | null;
    birthDate: string | null;
    experiences: Array<{
      id: string;
      company: string;
      role: string;
      description: string;
      employmentType: string;
      location: string;
      startDate: string;
      endDate: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    educations: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      startYear: number;
      endYear: number | null;
      description: string;
      createdAt: string;
      updatedAt: string;
    }>;
    skills: Array<{
      name: string;
    }>;
  };
  job: {
    id: string;
    title: string;
    location: string;
    typeOfEmployment: string;
    company: {
      id: string;
      companyName: string;
      logoUrl: string | null;
    };
  };
  interviewSchedules: Array<{
    companyName: string;
    createdBy: number;
    title: string;
    type: string;
    status: string;
    startsAt: string;
    endsAt: string;
    location: string;
    notes: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface UpdateApplicationStatusData {
  status: ApplicationStatus;
  applicantId: string;
}

export interface UpdateApplicationStatusResponse {
  message: string;
  success: boolean;
}

export interface MarkAsReadResponse {
  message: string;
  success: boolean;
}

// Application By JobID
export interface ApplicationByJobId {
  id: string;
  applicantName: string;
  applicationStatus: ApplicationStatus;
  appliedDate: string;
  ai_score?: number; // Score from 0-100
  ai_analysis?: string; // Detailed text analysis
  ai_status?: string;
  isRead: boolean;
}

export interface ApplicationByJobIdResponse {
  applications: ApplicationByJobId[];
  meta: {
    count: number;
  };
}

// export interface ApplicationByJobIdFilters {
// }

export interface ApplicationByJobIdRequest {
  jobId: string;
  offset: number;
  limit: number;
}
