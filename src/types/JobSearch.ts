// Enum-like types for specific fields
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

// Request interface
export interface JobSearchRequest {
  q?: string; // Search query
  location?: string; // Location filter
  categoryIds?: string[]; // Array of category IDs
  companyIds?: string[]; // Array of company IDs
  employmentTypes?: EmploymentType[]; // Array of employment types
  salaryMin?: number; // Minimum salary
  salaryMax?: number; // Maximum salary
  minExperienceYears?: number; // Minimum years of experience
  activeOnly?: boolean; // Show only active jobs (default: true)
  sortBy?: JobSearchSortBy; // Sort order (default: relevance)
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 10, max: 100)
}

// Job object within the data array
export interface Job {
  id: string; // Unique job identifier
  title: string; // Job title
  description: string; // Job description
  location: string; // Job location
  salaryMin: number; // Minimum salary
  salaryMax: number; // Maximum salary
  experienceYears: number; // Required experience in years
  typeOfEmployment: EmploymentType; // Type of employment
  deadline: string; // Application deadline (ISO 8601 format)
  company: {
    id: string; // Company identifier
    companyName: string; // Company name
    logoUrl: string; // URL to company logo
    industry: string; // Company industry
  };
  category: {
    id: string; // Category identifier
    name: string; // Category name
  };
  applicationStats: {
    totalApplications: number; // Number of applications received
    maxCapacity: number; // Maximum number of applications allowed
    applicationRate: number; // Rate of applications (e.g., per day)
  };
  relevanceScore: number; // Relevance score for sorting
  createdAt: string; // Job creation date (ISO 8601 format)
}

// Pagination details
export interface Pagination {
  currentPage: number; // Current page number
  itemsPerPage: number; // Number of items per page
  totalItems: number; // Total number of jobs
  totalPages: number; // Total number of pages
  hasNextPage: boolean; // Indicates if there is a next page
  hasPreviousPage: boolean; // Indicates if there is a previous page
}

// Summary of applied filters
export interface FilterSummary {
  query: string; // Search query used
  location: string; // Location filter applied
  categoriesCount: number; // Number of categories filtered
  companiesCount: number; // Number of companies filtered
  employmentTypesCount: number; // Number of employment types filtered
  activeOnly: boolean; // Whether only active jobs were shown
  sortBy: JobSearchSortBy; // Sort order applied
}

// Metadata about the response
export interface Meta {
  message: string; // Response message (e.g., "Success")
  success: boolean; // Indicates if the request was successful
}

// Full response structure
export interface JobSearchResponse {
  data: Job[]; // Array of job objects
  pagination: Pagination; // Pagination information
  filterSummary: FilterSummary; // Summary of filters applied
  meta: Meta; // Metadata
}
