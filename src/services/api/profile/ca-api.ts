import {
  CandidateProfile,
  updateAboutSectionRequestDto,
  updateProfileHeaderRequestDto,
  updateProfileResponseDto,
} from '@/types/CandidateProfile';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class CandidateProfileService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath(
      'candidate-profile',
    );
  }

  async getCandidateProfile(): Promise<CandidateProfile> {
    const url = this.requestBuilder.buildUrl('me');
    const response = await httpClient.get<CandidateProfile>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as CandidateProfile,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response;
  }

  async updateAboutSectionCandidateProfile(
    about: updateAboutSectionRequestDto,
  ): Promise<updateProfileResponseDto> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.patch<
      updateProfileResponseDto,
      updateAboutSectionRequestDto
    >({
      url,
      body: about,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as updateProfileResponseDto,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async updateProfileHeader(
    profileHeader: updateProfileHeaderRequestDto,
  ): Promise<updateProfileResponseDto> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.patch<
      updateProfileResponseDto,
      updateProfileHeaderRequestDto
    >({
      url,
      body: profileHeader,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as updateProfileResponseDto,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }
}

export const candidateProfileService = new CandidateProfileService();
