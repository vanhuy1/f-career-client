export interface Company {
  id: string;
  companyName: string;
  taxCode: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyManagementData {
  companies: Company[];
  count: number;
  limit: number;
  offset: number;
}

export interface ApiMeta {
  apiVersion: string;
}

export interface CompanyResponse {
  data: CompanyManagementData;
  meta: ApiMeta;
}

export interface VerifyCompanyResponse {
  data: Company;
  meta: ApiMeta;
}

export interface UnverifyCompanyResponse {
  data: Company;
  meta: ApiMeta;
}

export interface CompanyManagementRequest {
  limit: number;
  offset: number;
  isVerified?: boolean;
}

// Company Detail
export interface CompanyUserLite {
  id: number;
  username: string;
  name: string;
  email: string;
  isAccountDisabled: boolean;
}

export interface CategoryLite {
  id: string;
  name: string;
}

export interface OpenPosition {
  id: string;
  title: string;
  category: CategoryLite;
  location: string;
  status: string; // e.g. OPEN
  typeOfEmployment: string; // FULL_TIME, CONTRACT, etc.
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  topJob: number;
}

export interface CompanyDetail {
  id: string;
  logoUrl: string | null;
  companyName: string;
  phone: number | null;
  email: string;
  foundedAt: string | null;
  employees: number | null;
  address: string[];
  website: string | null;
  industry: string | null;
  description: string | null;
  socialMedia: string[]; // unknown structure, using string[] for links/handles
  workImageUrl: string[];
  coreTeam: unknown[];
  benefits: string[];
  openPositions: OpenPosition[];
  taxCode: string;
  businessLicenseUrl: string | null;
  isVerified: boolean;
  users: CompanyUserLite[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDetailResponse {
  data: CompanyDetail;
  meta: ApiMeta;
}
