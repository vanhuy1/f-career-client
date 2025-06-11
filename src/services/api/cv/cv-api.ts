import { Cv } from '@/types/Cv';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

interface CvListResponse {
  items: Cv[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

interface CvResponse {
  data: Cv;
  meta?: string;
}

class CvService {
  private rb = new RequestBuilder().setResourcePath('cvs');

  async findAll(userId: number): Promise<CvListResponse> {
    const url = this.rb.buildUrl(`user/${userId}`);
    console.log('Fetching CVs for user:', userId, 'URL:', url);
    const response = await httpClient.get<CvListResponse>({
      url,
      typeCheck: (data) => {
        const listResponse = data as CvListResponse;
        return { success: true, data: listResponse };
      },
    });
    return response;
  }

  async findById(id: string | number): Promise<Cv> {
    const url = this.rb.buildUrl(id.toString());
    const response = await httpClient.get<CvResponse>({
      url,
      typeCheck: (data) => {
        const rawData = data as CvResponse | Cv;
        const cvData = 'data' in rawData ? rawData.data : rawData;

        const processedData = {
          ...cvData,
          experiences: cvData.experience || [],
          education: cvData.education || [],
          certifications: cvData.certifications || [],
          skills: cvData.skills || [],
        };

        return { success: true, data: processedData };
      },
    });
    return response.data;
  }

  async create(cv: Partial<Cv>): Promise<Cv> {
    const url = this.rb.buildUrl();
    const response = await httpClient.post<CvResponse, Partial<Cv>>({
      url,
      body: cv,
      typeCheck: (data) => {
        const cvResponse = data as CvResponse;
        return { success: true, data: cvResponse.data };
      },
    });
    return response.data;
  }

  async update(id: string | number, cv: Partial<Cv>): Promise<Cv> {
    const url = this.rb.buildUrl(id.toString());
    const response = await httpClient.patch<CvResponse, Partial<Cv>>({
      url,
      body: {
        ...cv,
        experience: cv.experience || [],
        education: cv.education || [],
        certifications: cv.certifications || [],
        skills: cv.skills || [],
      },
      typeCheck: (data) => {
        const cvResponse = data as CvResponse;
        return { success: true, data: cvResponse.data };
      },
    });
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    const url = this.rb.buildUrl(id.toString());
    await httpClient.delete({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
  }
}

export const cvService = new CvService();
