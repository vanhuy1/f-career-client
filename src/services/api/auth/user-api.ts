import { ProfileData } from '@/types/CandidateSettings';
import {
  CandidateScheduleResponse,
  GetCandidateScheduleRequest,
} from '@/types/Schedule';
import {
  UpdatePasswordRequest,
  UserProfile,
  AiPointsResponse,
} from '@/types/User';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class UserService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('users');
  }

  async getMe(): Promise<UserProfile> {
    const url = this.requestBuilder.buildUrl('me');
    const response = await httpClient.get<UserProfile>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as UserProfile,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async updateMe(data: ProfileData): Promise<UserProfile> {
    const url = this.requestBuilder.buildUrl('');
    const response = await httpClient.patch<UserProfile, ProfileData>({
      url,
      body: data,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as UserProfile,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async updatePassword(
    data: UpdatePasswordRequest,
  ): Promise<{ message: string }> {
    const url = this.requestBuilder.buildUrl('change-password');
    const response = await httpClient.post<
      { message: string },
      UpdatePasswordRequest
    >({
      url,
      body: data,
      typeCheck: (data) => ({
        success: true,
        data: data as { message: string },
      }),
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async getScheduleInCandidateSite(
    data: GetCandidateScheduleRequest,
  ): Promise<CandidateScheduleResponse> {
    const queryParams = new URLSearchParams();

    if (data?.type) queryParams.append('type', data.type);
    if (data?.status) queryParams.append('status', data.status);
    if (data?.page) queryParams.append('page', data.page.toString());
    if (data?.limit) queryParams.append('limit', data.limit.toString());
    if (data?.startDate) queryParams.append('startDate', data.startDate);
    if (data?.endDate) queryParams.append('endDate', data.endDate);

    const url = this.requestBuilder.buildUrl(
      `me/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    );

    const response = await httpClient.get<CandidateScheduleResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as CandidateScheduleResponse,
        };
      },
    });
    return response;
  }

  async getAiPoints(): Promise<AiPointsResponse> {
    const url = this.requestBuilder.buildUrl('ai-points');
    const response = await httpClient.get<AiPointsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as AiPointsResponse,
        };
      },
    });
    return response;
  }
}

export const userService = new UserService();
