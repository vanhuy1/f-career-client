export interface RegistrationTrend {
  date: string;
  registrations: number;
  localRegistrations: number;
  googleRegistrations: number;
}

export interface DemographicItem {
  name: string;
  count: number;
  percentage: number;
}

export interface Demographics {
  userByRoles: DemographicItem[];
  userByProvider: DemographicItem[];
  userByAccountStatus: DemographicItem[];
  userByGender: DemographicItem[];
}

export interface ActivityMetrics {
  activeUsersLast30Days: number;
  accountVerificationRate: number;
  averageProfileCompletionRate: number;
  usersWithCompleteProfiles: number;
  activeJobSeekers: number;
}

export interface UserAnalyticsData {
  registrationTrends: RegistrationTrend[];
  demographics: Demographics;
  activityMetrics: ActivityMetrics;
}

export interface UserAnalyticsResponse {
  meta: Record<string, unknown>;
  data: UserAnalyticsData;
}

export interface UserAnalyticsParams {
  startDate: string;
  endDate: string;
  interval: 'daily' | 'weekly' | 'monthly';
}
