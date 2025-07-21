export interface JobPostingTrend {
  date: string;
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  vipJobs: number;
}

export interface CategoryAnalysis {
  categoryId: string;
  categoryName: string;
  count: number;
  percentage: number;
  avgApplications: number;
  avgSalary: number;
}

export interface EmploymentTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  avgSalary: number;
}

export interface SalaryRange {
  range: string;
  count: number;
  percentage: number;
}

export interface SalaryAnalytics {
  averageSalary: number;
  medianSalary: number;
  minSalary: number;
  maxSalary: number;
  salaryRanges: SalaryRange[];
}

export interface VipJobsAnalytics {
  totalVipJobs: number;
  vipJobsRevenue: number;
  avgVipDuration: number;
  vipConversionRate: number;
  activeVipJobs: number;
}

export interface PopularSkill {
  skillId: string;
  skillName: string;
  jobCount: number;
  percentage: number;
}

export interface JobAnalyticsData {
  jobPostingTrends: JobPostingTrend[];
  categoryAnalysis: CategoryAnalysis[];
  employmentTypeDistribution: EmploymentTypeDistribution[];
  salaryAnalytics: SalaryAnalytics;
  vipJobsAnalytics: VipJobsAnalytics;
  popularSkills: PopularSkill[];
}

export interface JobAnalyticsResponse {
  meta: Record<string, unknown>;
  data: JobAnalyticsData;
}

export interface JobAnalyticsParams {
  startDate: string;
  endDate: string;
  interval: 'daily' | 'weekly' | 'monthly';
}
