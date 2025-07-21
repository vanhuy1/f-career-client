import { RequestBuilder } from '@/utils/axios/request-builder';
import { AnalyticsResponse } from '@/types/admin/Analytics';
import {
  UserAnalyticsResponse,
  UserAnalyticsParams,
} from '@/types/admin/UserAnalytics';
import {
  JobAnalyticsResponse,
  JobAnalyticsParams,
} from '@/types/admin/JobAnalytics';
import {
  ApplicationAnalyticsResponse,
  ApplicationAnalyticsParams,
} from '@/types/admin/ApplicationAnalytics';
import {
  CompanyAnalyticsResponse,
  CompanyAnalyticsParams,
} from '@/types/admin/ComanyAnalytics';
import { httpClient } from '@/utils/axios';

class AnalyticsService {
  private requestBuilder: RequestBuilder;
  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath(
      'admin/analytics',
    );
  }

  async getDashboardAnalytics(): Promise<AnalyticsResponse> {
    const url = this.requestBuilder.buildUrl('dashboard');
    const response = await httpClient.get<AnalyticsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as AnalyticsResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }

  async getUserAnalytics(
    params: UserAnalyticsParams,
  ): Promise<UserAnalyticsResponse> {
    const baseUrl = this.requestBuilder.buildUrl('users');
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      interval: params.interval,
    });
    const url = `${baseUrl}?${queryParams.toString()}`;

    const response = await httpClient.get<UserAnalyticsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as UserAnalyticsResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }

  async getJobAnalytics(
    params: JobAnalyticsParams,
  ): Promise<JobAnalyticsResponse> {
    const baseUrl = this.requestBuilder.buildUrl('jobs');
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      interval: params.interval,
    });
    const url = `${baseUrl}?${queryParams.toString()}`;

    const response = await httpClient.get<JobAnalyticsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as JobAnalyticsResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }

  async getApplicationAnalytics(
    params: ApplicationAnalyticsParams,
  ): Promise<ApplicationAnalyticsResponse> {
    const baseUrl = this.requestBuilder.buildUrl('applications');
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      interval: params.interval,
    });
    const url = `${baseUrl}?${queryParams.toString()}`;

    const response = await httpClient.get<ApplicationAnalyticsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as ApplicationAnalyticsResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }

  async getCompanyAnalytics(
    params: CompanyAnalyticsParams,
  ): Promise<CompanyAnalyticsResponse> {
    const baseUrl = this.requestBuilder.buildUrl('companies');
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      interval: params.interval,
    });
    const url = `${baseUrl}?${queryParams.toString()}`;

    const response = await httpClient.get<CompanyAnalyticsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as CompanyAnalyticsResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }
}

export const analyticsService = new AnalyticsService();
