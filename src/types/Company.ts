// src/types/Company.ts

import { OpenPositionsJob } from './Job';
import { ApplicationStatus } from '@/enums/applicationStatus';

export interface Company {
  id: string;
  logoUrl?: string | null;
  companyName: string;
  phone?: number;
  email?: string;
  foundedAt?: string;
  employees?: number;
  address?: string[] | null;
  website?: string;
  industry?: string | null;
  description?: string | null;
  socialMedia?: string[];
  workImageUrl?: string[];
  coreTeam?: CoreTeamMember[];
  benefits?: Benefit[];
  openPositions?: OpenPositionsJob[];
  taxCode?: string;
  businessLicenseUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // New BE fields
  topCompany?: boolean | number;
  topJobExpired?: string | null;
  priorityPosition?: number | null;
  vipExpired?: string | null;
}

export interface CoreTeamMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
}

export interface Job {
  id: string;
  title: string;
  category: {
    id: string;
    name: string | null;
  };
  location: string;
  typeOfEmployment: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyReq {
  logoUrl?: string | null; // Allow null
  companyName: string;
  phone?: number;
  email?: string;
  foundedAt?: string;
  employees?: number;
  address?: string[] | null;
  website?: string;
  industry?: string | null;
  description?: string | null;
  socialMedia?: string[];
  workImageUrl?: string[];
  coreTeam?: CoreTeamMember[];
  benefits?: Benefit[];
  openPositions?: OpenPositionsJob[];
  taxCode?: string;
  businessLicenseUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  priorityPosition?: number | null;
  vipExpired?: string | null;
}

export type ContactInfo = {
  [key: string]: string;
};

export type Location = {
  country: string;
  emoji: string;
  isHQ: boolean;
  name: {
    common: string;
    official: string;
    nativeName: Record<string, string>;
  };
  flag: string;
};

export type Country = {
  name: string;
  code: string;
  flag: string;
};

export type CountryOption = {
  value: string;
  label: string;
  flag: string;
};

export interface NativeName {
  [language: string]: {
    official: string;
    common: string;
  };
}

export interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface TechStack {
  name: string;
  logo: string;
}

export interface SocialLinks {
  twitter: string;
  facebook: string;
  linkedin: string;
}

export interface OfficeLocation {
  country: string;
  flag: string;
}
/** Dùng cho response GET /companies */
export interface Meta {
  count: number;
  page: number;
}

export interface CompanyListResponse {
  data: Company[];
  meta: Meta;
}

/** Payload khi cập nhật company */
export type UpdateCompanyReq = Partial<CreateCompanyReq>;

// ----------------------
// Company Stats Types
// ----------------------

export interface JobStatsByStatus {
  open: number;
  closed: number;
  active: number;
  expired: number;
}

export interface JobStatsByCategoryItem {
  categoryId: string;
  name: string;
  count: number;
}

export interface JobStats {
  byStatus: JobStatsByStatus;
  lastMonth: number;
  byCategory: JobStatsByCategoryItem[];
}

export interface ApplicationStatusCountItem {
  status: ApplicationStatus; // e.g., INTERVIEW, HIRED, REJECTED, etc.
  count: number;
}

export interface ApplicationsStats {
  byStatus: ApplicationStatusCountItem[];
  lastMonth: number;
  today: number;
}

export interface CompanyStats {
  totalJobs: number;
  totalApplications: number;
  jobs: JobStats;
  applications: ApplicationsStats;
}
