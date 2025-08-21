export interface JobDetails {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  applicationsCount: number;
  capacity: number;
  applyBefore: string;
  postedOn: string;
  type: string;
  experienceYears: number;
  salary: string;
  status: string;
  categories: string[];
  requiredSkills: string[];
  companyName: string;
  companyLogo?: string;
  location?: string;
}
