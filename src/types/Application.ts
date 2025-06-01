export interface Application {
  id: number;
  company: {
    id: number;
    name: string;
    logo: string;
    website: string;
    industry: string;
  };
  role: string;
  dateApplied: string;
  status: ApplicationStatus;
}

export type ApplicationStatus =
  | 'IN_REVIEW'
  | 'INTERVIEWING'
  | 'ASSESSMENT'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED';

export interface FetchApplicationsRequest {
  page: number;
  limit: number;
  status?: ApplicationStatus | 'ALL';
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export interface FetchApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
}

// Extended Application Type with more details
export interface DetailedApplication extends Application {
  jobDescription: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    type: 'remote' | 'hybrid' | 'on-site';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  requiredSkills: string[];
  contacts: ContactPerson[];
  documents: ApplicationDocument[];
}

// Contact Person
export interface ContactPerson {
  id: number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

// Application Document
export interface ApplicationDocument {
  id: number;
  type:
    | 'resume'
    | 'cover_letter'
    | 'portfolio'
    | 'reference'
    | 'assessment'
    | 'other';
  name: string;
  url?: string;
  dateUploaded: string;
  version?: number;
}

export interface FetchApplicationDetailRequest {
  applicationId: number;
}
export interface FetchApplicationDetailResponse {
  application: DetailedApplication;
}
