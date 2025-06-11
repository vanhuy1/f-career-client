import { Application, ApplicationsResponse } from '@/types/Application';
import { RequestBuilder } from '@/utils/axios/request-builder';
import { ApplicationFormData } from '@/app/(public)/_components/apply-dialog';
import { httpClient } from '@/utils/axios';

class ApplicationService {
  private requestBuilder: RequestBuilder;
  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('applications');
  }

  async getApplications(
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ data: ApplicationsResponse[]; total: number }> {
    const url = this.requestBuilder.buildUrl('user');
    const response = await httpClient.get<{
      data: ApplicationsResponse[];
      total: number;
    }>({
      url,
      typeCheck: (data) => {
        // Assume API returns { data: [], total: number }
        return {
          success: true,
          data: data as { data: ApplicationsResponse[]; total: number },
        };
      },
      config: {
        params: {
          limit,
          offset,
        },
        withCredentials: false,
      },
    });
    return response;
  }

  // async getApplication(id?: string): Promise<Application> {
  //     return
  // }

  async applyJob(
    data: ApplicationFormData,
    jobId: number,
  ): Promise<Application> {
    const url = this.requestBuilder.buildUrl();
    const requestBody = {
      ...data,
      jobId,
    };
    const response = await httpClient.post<Application, typeof requestBody>({
      url,
      body: requestBody,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as Application,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }
}

export const applicationService = new ApplicationService();
