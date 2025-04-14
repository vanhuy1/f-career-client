import {
  LoginRequest,
  LoginResponse,
  loginResponseSchema,
} from '@/schemas/Auth';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

export interface UserProfile {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

class AuthService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('auth');
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const url = this.requestBuilder.buildUrl('login');

    return httpClient.post<LoginResponse, LoginRequest>({
      url: url,
      body: credentials,
      typeCheck: (data) => loginResponseSchema.safeParse(data),
      config: {
        withCredentials: false,
      },
    });
  }

  async getProfile(): Promise<UserProfile> {
    try {
      const url = this.requestBuilder.buildUrl('profile');
      const data = await httpClient.get<UserProfile>({
        url,
        config: {
          withCredentials: false,
        },
      });
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const url = this.requestBuilder.buildUrl('refresh-token');
    return httpClient.post<LoginResponse, { refreshToken: string }>({
      url,
      body: { refreshToken },
      typeCheck: (data) => loginResponseSchema.safeParse(data),
    });
  }
}

export const authService = new AuthService();
