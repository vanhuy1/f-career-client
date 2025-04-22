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
