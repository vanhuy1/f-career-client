import { ProfileData } from '@/types/CandidateSettings';
import { UpdatePasswordRequest, UserProfile } from '@/types/User';
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

  async updatePassword(data: UpdatePasswordRequest): Promise<UserProfile> {
    const url = this.requestBuilder.buildUrl('');
    const response = await httpClient.patch<UserProfile, UpdatePasswordRequest>(
      {
        url,
        body: data,
      },
    );
    return response;
  }
}

export const userService = new UserService();
