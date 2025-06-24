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
  responsibility: string[];
  jobFitAttributes: string[];
  niceToHave: string[];
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

export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'HIRED' | 'REJECTED';
