import {
  CreateEducationDto,
  Education,
  UpdateEducationDto,
} from '@/types/CandidateProfile';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class CadidateEducationService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('education');
  }

  async CreateEducation(education: CreateEducationDto): Promise<Education> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.post<Education, CreateEducationDto>({
      url,
      body: education,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as Education,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async UpdateEducation(education: UpdateEducationDto): Promise<Education> {
    const url = this.requestBuilder.buildUrl(education.id);
    const response = await httpClient.patch<Education, UpdateEducationDto>({
      url,
      body: education,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as Education,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }
}

export const candidateEducationService = new CadidateEducationService();
