export interface RegistrationTrend {
  date: string;
  newCompanies: number;
}

export interface SizeDistribution {
  sizeRange: string;
  count: number;
  percentage: number;
  avgJobPostings: number;
}

export interface IndustryAnalysis {
  industry: string;
  count: number;
  percentage: number;
  avgJobPostings: number;
  totalApplications: number;
  avgHireRate: number;
}

export interface TopHiringCompany {
  companyId: string;
  companyName: string;
  totalJobs: number;
  totalApplications: number;
  totalHires: number;
  hireRate: number;
  avgTimeToHire: number;
}

export interface GeographicDistribution {
  location: string;
  count: number;
  percentage: number;
  totalJobs: number;
  avgSalary: number;
}

export interface GrowthMetrics {
  totalCompanies: number;
  activeCompanies: number;
  newCompaniesThisMonth: number;
  growthRate: number;
  avgCompanySize: number;
  verifiedCompanies: number;
}

export interface CompanyAnalyticsData {
  registrationTrends: RegistrationTrend[];
  sizeDistribution: SizeDistribution[];
  industryAnalysis: IndustryAnalysis[];
  topHiringCompanies: TopHiringCompany[];
  geographicDistribution: GeographicDistribution[];
  growthMetrics: GrowthMetrics;
}

export interface CompanyAnalyticsResponse {
  meta: Record<string, unknown>;
  data: CompanyAnalyticsData;
}

export interface CompanyAnalyticsParams {
  startDate: string;
  endDate: string;
  interval: string;
}
