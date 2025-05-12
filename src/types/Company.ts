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
