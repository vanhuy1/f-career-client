// src/types/Company.ts

export interface Company {
  id: string;
  companyName: string;
  taxCode: string;
  industry?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  address?: string | null;
  businessLicenseUrl?: string | null;
  isVerified: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}
export type ContactInfo = {
  [key: string]: string;
};

export interface Country {
  name: Name;
  flag: string;
}

export interface Location extends Country {
  country: string;
  emoji: string;
  isHQ?: boolean;
}

export interface CountryOption {
  name: string;
  emoji: string;
}

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

/** Payload khi tạo mới company */
export interface CreateCompanyReq {
  companyName: string;
  taxCode: string;
  industry?: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  businessLicenseUrl?: string;
}

/** Payload khi cập nhật company */
export type UpdateCompanyReq = Partial<CreateCompanyReq>;
