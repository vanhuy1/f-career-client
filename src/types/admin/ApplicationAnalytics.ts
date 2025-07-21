export interface ApplicationTrend {
  date: string;
  applications: number;
  hired: number;
  rejected: number;
  interview: number;
  applied: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  avgTimeInStatus: number;
}

export interface ConversionRates {
  applicationToInterview: number;
  interviewToHire: number;
  overallHireRate: number;
  rejectionRate: number;
}

export interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface ProcessingStatus {
  completed: number;
  pending: number;
  failed: number;
  successRate: number;
}

export interface AiAnalysisInsights {
  averageAiScore: number;
  medianAiScore: number;
  scoreDistribution: ScoreDistribution[];
  processingStatus: ProcessingStatus;
  scoreHireCorrelation: number;
}

export interface TimeMetrics {
  averageTimeToResponse: number;
  averageTimeToHire: number;
  averageTimeToRejection: number;
  averageTimeToDecision: number;
}

export interface TopPerformingJob {
  jobId: string;
  jobTitle: string;
  companyName: string;
  totalApplications: number;
  hires: number;
  hireRate: number;
  avgAiScore: number;
}

export interface ApplicationAnalyticsData {
  applicationTrends: ApplicationTrend[];
  statusDistribution: StatusDistribution[];
  conversionRates: ConversionRates;
  aiAnalysisInsights: AiAnalysisInsights;
  timeMetrics: TimeMetrics;
  topPerformingJobs: TopPerformingJob[];
}

export interface ApplicationAnalyticsResponse {
  meta: Record<string, unknown>;
  data: ApplicationAnalyticsData;
}

export interface ApplicationAnalyticsParams {
  startDate: string;
  endDate: string;
  interval: 'daily' | 'weekly' | 'monthly';
}
