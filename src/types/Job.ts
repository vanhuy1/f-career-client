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

export interface Job {
  id?: string;
  title: string;
  category: Category;
  company: CompanyInfo;
  responsibility: string[];
  jobFitAttributes: string[];
  niceToHave: string[];
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
  createdAt?: string;
  updatedAt?: string;
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
  responsibility: string[];
  jobFitAttributes: string[];
  niceToHave: string[];
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
  handleAddSkill: (skillId: string) => void;
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
}

export interface JobCategory {
  id: string;
  name: string;
}

export interface JobFormData {
  title: string;
  category: Category;
  responsibility: string[];
  jobFitAttributes: string[];
  niceToHave: string[];
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
  responsibility: string[];
  jobFitAttributes: string[];
  niceToHave: string[];
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
