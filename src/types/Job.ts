import { Company } from './Company';

export interface Job {
  title: string;
  company: Company;
  location: string;
  logo: string;
  tags: string[];
  applied: number;
  capacity: number;
}

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
}
