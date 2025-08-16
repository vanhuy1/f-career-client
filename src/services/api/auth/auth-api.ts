import {
  CompanyRegistrationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from '@/schemas/Auth';
import { AuthResponse } from '@/types/Auth';
import { User } from '@/types/User';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

interface TaxCodeReportPayload {
  taxCode: string;
  companyName: string;
  userEmail: string;
  contactPhone: string;
  additionalInfo: string;
  reportType: string;
  timestamp: string;
}

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

  async registerCompany(
    data: CompanyRegistrationRequest,
  ): Promise<{ message: string }> {
    const url = this.requestBuilder.buildUrl('register-company');
    const response = await httpClient.post<
      { message: string },
      CompanyRegistrationRequest
    >({
      url,
      body: data,
      typeCheck: (data) => ({
        success: true,
        data: data as { message: string },
      }),
    });
    return response;
  }

  async verifyCompany(code: string): Promise<{ message: string }> {
    const url = this.requestBuilder.buildUrl(
      `verify-company?code=${encodeURIComponent(code)}`,
    );
    const response = await httpClient.get<{ message: string }>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as { message: string },
      }),
    });
    return response;
  }

  async verifyEmail(
    token: string,
  ): Promise<{ message: string; success: boolean }> {
    const url = this.requestBuilder.buildUrl(`verify?token=${token}`);
    const response = await httpClient.get<{
      message: string;
      success: boolean;
    }>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as { message: string; success: boolean },
      }),
    });
    return response;
  }

  // Trong authService class
  async sendTaxCodeReport(
    data: TaxCodeReportPayload,
  ): Promise<{ message: string }> {
    const url = this.requestBuilder.buildUrl('report/tax-code-issue');
    const response = await httpClient.post<
      { message: string },
      TaxCodeReportPayload
    >({
      url,
      body: data,
      typeCheck: (data) => ({
        success: true,
        data: data as { message: string },
      }),
    });
    return response;
  }

  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<{ message: string }> {
    const url = this.requestBuilder.buildUrl('forgot-password');
    const response = await httpClient.post<
      { message: string },
      ForgotPasswordRequest
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

  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<{ message: string }> {
    const url = this.requestBuilder.buildUrl('reset-password');
    const response = await httpClient.post<
      { message: string },
      ResetPasswordRequest
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
}

export const authService = new AuthService();
