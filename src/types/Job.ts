// src/types/Job.ts

import { Skill } from '@/services/api/skills/skill-api';

export interface Category {
  id: string;
  name: string;
}

export interface CompanyInfo {
  id: string;
  companyName: string;
  logoUrl: string;
  address: string;
}

export type EmploymentType =
  | 'FullTime'
  | 'PartTime'
  | 'Contract'
  | 'Internship';
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

export type PackageType = 'basic' | 'premium' | 'vip';

export interface PackageInfo {
  type: PackageType;
  purchasedAt: string;
  expiresAt: string;
  isActive: boolean;
  transactionId?: string;
  autoRenew?: boolean;
  durationDays?: number;
}

export interface Job {
  id?: string;
  title: string;
  category: Category;
  company: CompanyInfo;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  skills: Skill[];
  experienceYears: number;
  status: JobStatus;
  isVip: boolean;
  packageInfo?: PackageInfo;
  deadline: string;
  typeOfEmployment: EmploymentType;
  benefit: string[];
  createdAt?: string;
  updatedAt?: string;
  applicants: number;
  priorityPosition?: number;
  vip_expiration?: string;
}

export interface OpenPositionsJob {
  id: number;
  title: string;
  category: {
    id: string;
    name: string;
  };
  location: string;
  typeOfEmployment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  data: Job[];
  meta: {
    count: number;
    page: number;
  };
}

/** payload khi tạo job */
export interface CreateJobReq {
  title: string;
  categoryId: string;
  companyId: string;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceYears: number;
  status: JobStatus;
  isVip: boolean;
  packageInfo?: PackageInfo;
  deadline: string;
  typeOfEmployment: EmploymentType;
  benefit: string[];
}

/** payload khi cập nhật job */
export type UpdateJobReq = Partial<CreateJobReq>;

export interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Position {
  id: number;
  title: string;
  description: string;
  level: number;
}

export interface JobPostingState {
  currentStep: number;
  skills: string[];
  newSkill: string;
  salaryRange: number[];
  benefits: Benefit[];
  positions: Position[];
  packageInfo?: PackageInfo;
}

export interface StepProps {
  skills: string[];
  newSkill: string;
  salaryRange: number[];
  benefits: Benefit[];
  positions: Position[];
  packageInfo: PackageInfo | null;
  setSkills: (skills: string[]) => void;
  setNewSkill: (skill: string) => void;
  setSalaryRange: (range: number[]) => void;
  setBenefits: (benefits: Benefit[]) => void;
  setPositions: (positions: Position[]) => void;
  setPackageInfo: (info: PackageInfo) => void;
  handleAddSkill: (skill: string) => void;
  handleRemoveSkill: (skill: string) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  whoYouAre: string;
  setWhoYouAre: (desc: string) => void;
  benefit: string;
  setBenefit: (benefit: string) => void;
  typeOfEmployment: EmploymentType;
  setTypeOfEmployment: (type: EmploymentType) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  location: string;
  setLocation: (location: string) => void;
  isVip: boolean;
  setIsVip: (isVip: boolean) => void;
  deadline: string;
  setDeadline: (deadline: string) => void;
  experienceYears: number;
  setExperienceYears: (years: number) => void;
  availableSkills: Skill[];
  totalPrice?: number;
  setTotalPrice?: (price: number) => void;
}

export interface JobCategory {
  id: string;
  name: string;
}

export interface JobFormData {
  title: string;
  category: Category;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceYears: number;
  status: JobStatus;
  isVip: boolean;
  deadline: string;
  typeOfEmployment: EmploymentType;
  benefit: string[];
}

export interface JobCategory {
  id: string;
  name: string;
}

export interface JobFormData {
  title: string;
  category: Category;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceYears: number;
  status: JobStatus;
  isVip: boolean;
  deadline: string;
  typeOfEmployment: EmploymentType;
  benefit: string[];
}

// job list manage by company id
export interface JobByCompanyId {
  jobId: string;
  jobTitle: string;
  status: string;
  postedDate: string;
  endDate: string;
  jobType: string;
  totalApplications: number;
}

interface MetaJobByCompanyId {
  count: number;
  page: number;
}

export interface JobByCompanyIdResponse {
  data: JobByCompanyId[];
  meta: MetaJobByCompanyId;
}

export interface JobByCompanyIdParams {
  limit?: number;
  offset?: number;
}
