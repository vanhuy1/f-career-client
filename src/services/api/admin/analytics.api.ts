import { RequestBuilder } from '@/utils/axios/request-builder';
import { AnalyticsResponse } from '@/types/admin/Analytics';
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
}

export const analyticsService = new AnalyticsService();
