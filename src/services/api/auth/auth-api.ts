import { SignInRequest, SignUpRequest } from '@/schemas/Auth';
import { AuthResponse } from '@/types/Auth';
import { User } from '@/types/User';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';
class AuthService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('auth');
  }

  async signUp(data: SignUpRequest): Promise<User> {
    const url = this.requestBuilder.buildUrl('register');
    const response = await httpClient.post<User, SignUpRequest>({
      url,
      body: data,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as User,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const url = this.requestBuilder.buildUrl('login');
    const response = await httpClient.post<AuthResponse, SignInRequest>({
      url,
      body: data,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as AuthResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const url = this.requestBuilder.buildUrl('refresh-token');
    const response = await httpClient.post<
      AuthResponse,
      { refreshToken: string }
    >({
      url,
      body: { refreshToken },
      typeCheck: (data) => {
        return {
          success: true,
          data: data as AuthResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }
}

export const authService = new AuthService();
