import {
  CreateExperienceDto,
  Experience,
  UpdateExperienceDto,
} from '@/types/CandidateProfile';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class CandidateExperienceService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('experiences');
  }

  async CreateExperience(experience: CreateExperienceDto): Promise<Experience> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.post<Experience, CreateExperienceDto>({
      url,
      body: experience,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as Experience,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }

  async UpdateExperience(experience: UpdateExperienceDto): Promise<Experience> {
    const url = this.requestBuilder.buildUrl(experience.id);
    const response = await httpClient.patch<Experience, UpdateExperienceDto>({
      url,
      body: experience,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as Experience,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }
}

export const candidateExperienceService = new CandidateExperienceService();
