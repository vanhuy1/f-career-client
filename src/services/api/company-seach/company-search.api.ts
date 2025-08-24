import { RequestBuilder } from '@/utils/axios/request-builder';
import {
  CompanySearchRequest,
  CompanySearchResponse,
  CompanySuggestionsRequest,
  CompanySuggestionsResponse,
} from '@/types/CompanySearch';
import { httpClient } from '@/utils/axios';

class CompanySearchService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath(
      'company-search',
    );
  }

  async searchCompanies(
    params: CompanySearchRequest = {},
  ): Promise<CompanySearchResponse> {
    const url = this.requestBuilder.buildUrl('search');

    const response = await httpClient.get<CompanySearchResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as CompanySearchResponse,
        };
      },
      config: {
        params,
        withCredentials: false,
      },
    });

    return response;
  }

  async getCompanySuggestions(
    params: CompanySuggestionsRequest,
  ): Promise<CompanySuggestionsResponse> {
    const url = this.requestBuilder.buildUrl('suggestions');

    const response = await httpClient.get<CompanySuggestionsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as CompanySuggestionsResponse,
        };
      },
      config: {
        params,
        withCredentials: false,
      },
    });

    return response;
  }

  async getIndustries(): Promise<string[]> {
    const url = this.requestBuilder.buildUrl('industries');

    const response = await httpClient.get<string[]>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as string[],
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }
}

export const companySearchService = new CompanySearchService();
