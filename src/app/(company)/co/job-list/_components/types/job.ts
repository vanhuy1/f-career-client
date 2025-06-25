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
  salary: string;
  categories: string[];
  requiredSkills: string[];
}
