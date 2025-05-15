// src/types/Job.ts

import { Company } from './Company';

export interface Category {
  id: string;
  name: string;
}

export type EmploymentType =
  | 'FullTime'
  | 'PartTime'
  | 'Contract'
  | 'Internship'
  | string;
export type JobStatus = 'OPEN' | 'CLOSED' | string;

export interface Job {
  id: string;
  title: string;
  category: Category;
  company: Company;
  location: string;
  status: JobStatus;
  typeOfEmployment: EmploymentType;
  isVip: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date

  /** nếu backend có description mô tả chi tiết công việc thì để optional */
  description?: string;
  /** giữ lại logoUrl nếu bạn muốn override company.logoUrl */
  logoUrl?: string;

  /** những field phía client sử dụng trước đó */
  tags?: string[];
  applied?: number;
  capacity?: number;
}

export interface Meta {
  count: number;
  page: number;
}

export interface JobListResponse {
  data: Job[];
  meta: Meta;
}

/** payload khi tạo job */
export interface CreateJobReq {
  title: string;
  categoryId: string;
  companyId: string;
  location: string;
  typeOfEmployment: EmploymentType;
  tags?: string[];
  capacity?: number;
  /** nếu cần set status ngay lúc tạo */
  status?: JobStatus;
  description?: string;
  responsibility?: string[];
  jobFitAttributes?: string[];
  niceToHave?: string[];
  salaryMin?: number;
  salaryMax?: number;
  experienceYears?: number;
  isVip?: boolean;
  deadline?: string;
}

/** payload khi cập nhật job */
export type UpdateJobReq = Partial<CreateJobReq>;

export interface Benefit {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface JobPostingState {
  currentStep: number;
  skills: string[];
  newSkill: string;
  salaryRange: number[];
  benefits: Benefit[];
}

export interface StepProps {
  skills: string[];
  newSkill: string;
  salaryRange: number[];
  benefits: Benefit[];
  setSkills: (skills: string[]) => void;
  setNewSkill: (newSkill: string) => void;
  setSalaryRange: (range: number[]) => void;
  setBenefits: (benefits: Benefit[]) => void;
  handleAddSkill: () => void;
  handleRemoveSkill: (skill: string) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  responsibilities: string;
  setResponsibilities: (responsibilities: string) => void;
  whoYouAre: string;
  setWhoYouAre: (whoYouAre: string) => void;
  niceToHaves: string;
  setNiceToHaves: (niceToHaves: string) => void;
  employmentType: string[];
  setEmploymentType: (type: string[]) => void;
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
}
