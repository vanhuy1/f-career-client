export type EmploymentType =
  | 'FullTime'
  | 'PartTime'
  | 'Contract'
  | 'Internship'
  | 'Remote';
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
  employmentTypes?: EmploymentType[];
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
  typeOfEmployment: EmploymentType;
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
