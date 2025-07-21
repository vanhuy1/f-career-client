import { RequestBuilder } from '@/utils/axios/request-builder';
import { AnalyticsResponse } from '@/types/admin/Analytics';
import {
  UserAnalyticsResponse,
  UserAnalyticsParams,
} from '@/types/admin/UserAnalytics';
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
}

export const analyticsService = new AnalyticsService();
