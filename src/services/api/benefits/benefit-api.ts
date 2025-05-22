import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

export interface Benefit {
  data: Benefit | PromiseLike<Benefit>;
  id: string | number;
  name: string;
  description: string;
  iconUrl: string;
}

interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

class BenefitService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('companies');
  }

  async createBenefit(
    companyId: string,
    benefit: Partial<Benefit>,
  ): Promise<Benefit> {
    const url = this.requestBuilder.buildUrl(`${companyId}/benefits`);
    const response = await httpClient.post<Benefit, Partial<Benefit>>({
      url,
      body: benefit,
      typeCheck: (data: unknown) => {
        if (data && typeof data === 'object' && 'data' in data) {
          const responseData = (data as ApiResponse<Benefit>).data;
          if (
            responseData &&
            typeof responseData === 'object' &&
            'id' in responseData &&
            'name' in responseData &&
            'description' in responseData &&
            'iconUrl' in responseData
          ) {
            return {
              success: true,
              data: {
                id: responseData.id,
                name: responseData.name,
                description: responseData.description,
                iconUrl: responseData.iconUrl,
              },
            };
          }
        }
        throw new Error('Invalid response format from server');
      },
    });
    return response.data;
  }

  async updateBenefit(
    companyId: string,
    benefitId: string | number,
    benefit: Partial<Benefit>,
  ): Promise<Benefit> {
    const url = this.requestBuilder.buildUrl(
      `${companyId}/benefits/${benefitId}`,
    );
    const response = await httpClient.patch<
      ApiResponse<Benefit>,
      Partial<Benefit>
    >({
      url,
      body: benefit,
      typeCheck: (data: unknown) => {
        if (data && typeof data === 'object' && 'data' in data) {
          const responseData = (data as ApiResponse<Benefit>).data;
          if (
            responseData &&
            typeof responseData === 'object' &&
            'id' in responseData &&
            'name' in responseData &&
            'description' in responseData &&
            'iconUrl' in responseData
          ) {
            return {
              success: true,
              data: {
                id: responseData.id.toString(), // Ensure id is string
                name: responseData.name,
                description: responseData.description,
                iconUrl: responseData.iconUrl,
              },
            };
          }
        }
        throw new Error('Invalid response format from server');
      },
    });
    return response.data;
  }

  async deleteBenefit(companyId: string, benefitId: number): Promise<void> {
    const url = this.requestBuilder.buildUrl(
      `${companyId}/benefits/${benefitId}`,
    );
    await httpClient.delete({
      url,
    });
  }
}

export const benefitService = new BenefitService();
