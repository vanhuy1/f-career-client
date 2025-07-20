import { RequestBuilder } from '@/utils/axios/request-builder';
import {
  User,
  UserManagementRequest,
  UserResponse,
  UserStatusRequest,
  UserDetailResponse,
} from '@/types/admin/UserManagement';
import { httpClient } from '@/utils/axios';

class UserManagementService {
  private requestBuilder: RequestBuilder;
  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('admin/users');
  }

  async getUsers(request: UserManagementRequest): Promise<UserResponse> {
    const url = this.requestBuilder.buildUrl('');
    const response = await httpClient.get<UserResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as UserResponse,
        };
      },
      config: {
        params: {
          limit: request.limit,
          offset: request.offset,
        },
        withCredentials: false,
      },
    });

    return response;
  }

  async getUserDetail(id: string): Promise<User> {
    const url = this.requestBuilder.buildUrl(`${id}`);
    const response = await httpClient.get<UserDetailResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as UserDetailResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });

    return response.data;
  }

  async updateUserStatus(request: UserStatusRequest): Promise<User> {
    const url = this.requestBuilder.buildUrl(`${request.id}/status`);
    const response = await httpClient.patch<User, UserStatusRequest>({
      url,
      body: request,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as User,
        };
      },
    });
    return response;
  }
}

export const userManagementService = new UserManagementService();
