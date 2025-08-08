export interface Company {
  id: string;
  companyName: string;
  foundedAt: string;
  phone: number;
  email: string;
  employees: number;
  address: string[];
  website: string;
  industry: string;
  description: string | null;
  logoUrl: string | null;
  socialMedia: string[];
  workImageUrl: string[];
  taxCode: string;
  businessLicenseUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  experienceYears: number;
  status: string;
  typeOfEmployment: string;
  deadline: string;
  benefit: string[];
  isVip: boolean;
  company: Company;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
}

export interface Application {
  id: string;
  user: User;
  job: Job;
  company: Company;
  status: string;
  cv_id: string;
  cover_letter: string;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationsResponse {
  data: Application[];
  meta: {
    count: number;
  };
}

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'IN_REVIEW'
  | 'SHORTED_LIST'
  | 'INTERVIEW'
  | 'HIRED'
  | 'REJECTED';

export interface CandidateApplicationDetail {
  id: number;
  status: ApplicationStatus;
  cv_id: string;
  cover_letter: string;
  applied_at: string;
  updated_at: string;
  job: {
    id: string;
    title: string;
    location: string;
    typeOfEmployment: string;
    salaryMin: string;
    salaryMax: string;
    description: string;
  };
  company: {
    id: string;
    name: string;
    logoUrl: string;
    website: string;
    phone: string;
    email: string;
    about: string;
    contact: string[];
  };
  interviewSchedule?: {
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
  };
  interviewSchedules?: Array<{
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
