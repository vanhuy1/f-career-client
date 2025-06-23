import { Application, ApplicationsResponse } from '@/types/Application';
import { RequestBuilder } from '@/utils/axios/request-builder';
import { ApplicationFormData } from '@/app/(public)/_components/apply-dialog';
import { httpClient } from '@/utils/axios';
import {
  Applicants,
  ApplicantDetail,
  UpdateApplicationStatusData,
  UpdateApplicationStatusResponse,
} from '@/types/Applicants';

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

  async getApplicants(): Promise<Applicants> {
    const url = this.requestBuilder.buildUrl('hr');
    const response = await httpClient.get<Applicants>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: {
            data: Array.isArray((data as Applicants).data)
              ? (data as Applicants).data
              : Array.isArray(data)
                ? data
                : [],
            total:
              (data as Applicants).total ||
              (data as Applicants).data?.length ||
              0,
          } as Applicants,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async getApplicantDetail(applicantId: string): Promise<ApplicantDetail> {
    const url = this.requestBuilder.buildUrl(`${applicantId}/detail`);
    const response = await httpClient.get<ApplicantDetail>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as ApplicantDetail,
        };
      },
    });
    return response;
  }

  async updateHiringProgress(
    reqData: UpdateApplicationStatusData,
  ): Promise<UpdateApplicationStatusResponse> {
    const url = this.requestBuilder.buildUrl(`${reqData.applicantId}`);

    const response = await httpClient.patch<
      UpdateApplicationStatusResponse,
      typeof reqData
    >({
      url,
      body: reqData,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as UpdateApplicationStatusResponse,
        };
      },
    });

    return response;
  }
}

export const applicationService = new ApplicationService();
