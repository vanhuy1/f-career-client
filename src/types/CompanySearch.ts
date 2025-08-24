// src/types/CompanySearch.ts

export interface CompanySearchItem {
  id: string;
  companyName: string;
  logoUrl: string;
  industry: string;
}

export interface CompanySearchPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CompanySearchResponse {
  data: CompanySearchItem[];
  pagination: CompanySearchPagination;
}

export interface CompanySearchRequest {
  q?: string; // Search query
  industry?: string; // Industry filter
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 10)
}

export interface CompanySuggestionItem {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
}

export interface CompanySuggestionsResponse {
  keywords: string[];
  companies: CompanySuggestionItem[];
}

export interface CompanySuggestionsRequest {
  q: string; // Search query for suggestions
}
