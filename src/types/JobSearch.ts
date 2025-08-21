import { employmentType } from '@/enums/employmentType';

export type JobSearchSortBy =
  | 'relevance'
  | 'date_posted'
  | 'salary_high_to_low'
  | 'salary_low_to_high';

export interface JobSearchRequest {
  q?: string;
  location?: string;
  categoryIds?: string[];
  companyIds?: string[];
  employmentTypes?: employmentType[];
  salaryMin?: number;
  salaryMax?: number;
  minExperienceYears?: number;
  activeOnly?: boolean;
  sortBy?: JobSearchSortBy;
  page?: number;
  limit?: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceYears: number;
  typeOfEmployment: employmentType;
  deadline: string;
  company: {
    id: string;
    companyName: string;
    logoUrl: string;
    industry: string;
  };
  category: {
    id: string;
    name: string;
  };
  applicationStats: {
    totalApplications: number;
    maxCapacity: number;
    applicationRate: number;
  };
  relevanceScore: number;
  createdAt: string;
  isDeleted: boolean;
  topJob: number;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FilterSummary {
  query: string;
  location: string;
  categoriesCount: number;
  companiesCount: number;
  employmentTypesCount: number;
  activeOnly: boolean;
  sortBy: JobSearchSortBy;
}

export interface Meta {
  message: string;
  success: boolean;
}

export interface JobSearchResponse {
  data: Job[];
  pagination: Pagination;
  filterSummary: FilterSummary;
  meta: Meta;
}

// Interface for job search suggestions
export interface SuggestionKeyword {
  value: string;
  type: 'keyword';
}

export interface SuggestionJob {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  location: string;
  typeOfEmployment: string;
  type: 'job';
}

export interface SuggestionCompany {
  id: string;
  name: string;
  logoUrl: string | null;
  industry: string;
  type: 'company';
}

export interface SuggestionsResponse {
  keywords: SuggestionKeyword[];
  jobs: SuggestionJob[];
  companies: SuggestionCompany[];
}

export interface SuggestionQuery {
  q: string;
}
