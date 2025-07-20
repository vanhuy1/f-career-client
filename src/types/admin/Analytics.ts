export interface DashboardMetrics {
  totalUsers: number;
  totalActiveJobs: number;
  totalApplications: number;
  totalCompanies: number;
  userGrowthRate: number;
  jobGrowthRate: number;
  applicationGrowthRate: number;
  companyGrowthRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registration' | 'job_posted';
  description: string;
  timestamp: string;
  userId?: number;
  entityId?: string;
}

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AnalyticsData {
  dashboardMetrics: DashboardMetrics;
  recentActivity: RecentActivity[];
  alerts: Alert[];
}

export interface AnalyticsResponse {
  data: AnalyticsData;
  meta: {
    apiVersion: string;
  };
}
