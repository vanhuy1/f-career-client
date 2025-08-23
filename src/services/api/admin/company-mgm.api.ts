import { RequestBuilder } from '@/utils/axios/request-builder';
import { httpClient } from '@/utils/axios';
import {
  CompanyManagementRequest,
  CompanyResponse,
  VerifyCompanyResponse,
  CompanyDetailResponse,
  UnverifyCompanyResponse,
} from '@/types/admin/CompanyManagement';

class CompanyManagementService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath(
      'admin/companies',
    );
  }

  async getCompanies(
    request: CompanyManagementRequest,
  ): Promise<CompanyResponse> {
    const url = this.requestBuilder.buildUrl('');
    const response = await httpClient.get<CompanyResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as CompanyResponse,
        };
      },
      config: {
        params: {
          limit: request.limit,
          offset: request.offset,
          isVerified: request.isVerified,
        },
        withCredentials: false,
      },
    });

    return response;
  }

  async verifyCompany(id: string): Promise<VerifyCompanyResponse> {
    const url = this.requestBuilder.buildUrl(`${id}/verify`);
    const response = await httpClient.patch<
      VerifyCompanyResponse,
      Record<string, never>
    >({
      url,
      body: {},
      typeCheck: (data) => {
        return {
          success: true,
          data: data as VerifyCompanyResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async unverifyCompany(id: string): Promise<UnverifyCompanyResponse> {
    const url = this.requestBuilder.buildUrl(`${id}/unverify`);
    const response = await httpClient.patch<
      UnverifyCompanyResponse,
      Record<string, never>
    >({
      url,
      body: {},
      typeCheck: (data) => {
        return {
          success: true,
          data: data as UnverifyCompanyResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async getCompanyDetail(id: string): Promise<CompanyDetailResponse> {
    const url = this.requestBuilder.buildUrl(`${id}`);
    const response = await httpClient.get<CompanyDetailResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as CompanyDetailResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }
}

export const companyManagementService = new CompanyManagementService();
