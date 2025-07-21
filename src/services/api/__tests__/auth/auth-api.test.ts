import { authService } from '@/services/api/auth/auth-api';
import { httpClient } from '@/utils/axios';
import { SignInRequest, SignUpRequest } from '@/schemas/Auth';
import { ROLES } from '@/enums/roles.enum';
import { createMockUser, createMockAuthResponse } from '@/utils/test-utils';

// Mock the httpClient
jest.mock('@/utils/axios', () => ({
  httpClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

// Mock the RequestBuilder to avoid dependencies
jest.mock('@/utils/axios/request-builder', () => ({
  RequestBuilder: jest.fn().mockImplementation(() => ({
    setResourcePath: jest.fn().mockReturnThis(),
    buildUrl: jest.fn((path: string) => `/api/auth/${path}`),
  })),
}));

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const mockSignUpRequest: SignUpRequest = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      username: 'testuser',
      roles: [ROLES.USER],
    };

    it('should register a new user successfully', async () => {
      const mockUser = createMockUser({
        email: mockSignUpRequest.email,
        name: mockSignUpRequest.name,
        username: mockSignUpRequest.username,
      });

      mockedHttpClient.post.mockResolvedValueOnce(mockUser);

      const result = await authService.signUp(mockSignUpRequest);

      expect(mockedHttpClient.post).toHaveBeenCalledWith({
        url: '/api/auth/register',
        body: mockSignUpRequest,
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle registration errors', async () => {
      const mockError = new Error('Email already exists');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(authService.signUp(mockSignUpRequest)).rejects.toThrow(
        'Email already exists',
      );
    });

    it('should handle invalid input data', async () => {
      const invalidRequest: SignUpRequest = {
        email: 'invalid-email',
        password: '123',
        name: '',
        username: '',
        roles: ['invalid-role'] as any,
      };

      const mockError = new Error('Invalid input data');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(authService.signUp(invalidRequest)).rejects.toThrow(
        'Invalid input data',
      );
    });
  });

  describe('signIn', () => {
    const mockSignInRequest: SignInRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should sign in user successfully', async () => {
      const mockAuthResponse = createMockAuthResponse();
      mockedHttpClient.post.mockResolvedValueOnce(mockAuthResponse);

      const result = await authService.signIn(mockSignInRequest);

      expect(mockedHttpClient.post).toHaveBeenCalledWith({
        url: '/api/auth/login',
        body: mockSignInRequest,
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle invalid credentials', async () => {
      const mockError = new Error('Invalid credentials');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(authService.signIn(mockSignInRequest)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should handle network errors during sign in', async () => {
      const networkError = new Error('Network error');
      mockedHttpClient.post.mockRejectedValueOnce(networkError);

      await expect(authService.signIn(mockSignInRequest)).rejects.toThrow(
        'Network error',
      );
    });

    it('should handle empty credentials', async () => {
      const emptyRequest: SignInRequest = {
        email: '',
        password: '',
      };

      const mockError = new Error('Email and password are required');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(authService.signIn(emptyRequest)).rejects.toThrow(
        'Email and password are required',
      );
    });
  });

  describe('refreshToken', () => {
    const mockRefreshToken = 'mock-refresh-token';

    it('should refresh token successfully', async () => {
      const mockAuthResponse = createMockAuthResponse({
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });

      mockedHttpClient.post.mockResolvedValueOnce(mockAuthResponse);

      const result = await authService.refreshToken(mockRefreshToken);

      expect(mockedHttpClient.post).toHaveBeenCalledWith({
        url: '/api/auth/refresh-token',
        body: { refreshToken: mockRefreshToken },
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle invalid refresh token', async () => {
      const mockError = new Error('Invalid refresh token');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(authService.refreshToken(mockRefreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should handle expired refresh token', async () => {
      const mockError = new Error('Refresh token expired');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(authService.refreshToken(mockRefreshToken)).rejects.toThrow(
        'Refresh token expired',
      );
    });

    it('should handle empty refresh token', async () => {
      const mockError = new Error('Refresh token is required');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(authService.refreshToken('')).rejects.toThrow(
        'Refresh token is required',
      );
    });
  });

  describe('registerCompany', () => {
    const mockCompanySignUpRequest: SignUpRequest = {
      email: 'company@example.com',
      password: 'password123',
      name: 'Company Name',
      username: 'companyuser',
      roles: [ROLES.RECRUITER],
    };

    it('should register company successfully', async () => {
      const mockResponse = { message: 'Company registered successfully' };
      mockedHttpClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.registerCompany(
        mockCompanySignUpRequest,
      );

      expect(mockedHttpClient.post).toHaveBeenCalledWith({
        url: '/api/auth/register-company',
        body: mockCompanySignUpRequest,
        typeCheck: expect.any(Function),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle company registration errors', async () => {
      const mockError = new Error('Company already exists');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(
        authService.registerCompany(mockCompanySignUpRequest),
      ).rejects.toThrow('Company already exists');
    });

    it('should handle invalid company data', async () => {
      const invalidCompanyRequest: SignUpRequest = {
        email: 'invalid-email',
        password: '',
        name: '',
        username: '',
        roles: [ROLES.USER], // Wrong role for company
      };

      const mockError = new Error('Invalid company data');
      mockedHttpClient.post.mockRejectedValueOnce(mockError);

      await expect(
        authService.registerCompany(invalidCompanyRequest),
      ).rejects.toThrow('Invalid company data');
    });
  });

  describe('verifyCompany', () => {
    const mockVerificationCode = 'verification-code-123';

    it('should verify company successfully', async () => {
      const mockResponse = { message: 'Company verified successfully' };
      mockedHttpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.verifyCompany(mockVerificationCode);

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: `/api/auth/verify-company?code=${encodeURIComponent(
          mockVerificationCode,
        )}`,
        typeCheck: expect.any(Function),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid verification code', async () => {
      const mockError = new Error('Invalid verification code');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        authService.verifyCompany(mockVerificationCode),
      ).rejects.toThrow('Invalid verification code');
    });

    it('should handle expired verification code', async () => {
      const mockError = new Error('Verification code expired');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        authService.verifyCompany(mockVerificationCode),
      ).rejects.toThrow('Verification code expired');
    });

    it('should handle special characters in verification code', async () => {
      const specialCode = 'code-with-special-chars-!@#$%^&*()';
      const mockResponse = { message: 'Company verified successfully' };
      mockedHttpClient.get.mockResolvedValueOnce(mockResponse);

      await authService.verifyCompany(specialCode);

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: `/api/auth/verify-company?code=${encodeURIComponent(specialCode)}`,
        typeCheck: expect.any(Function),
      });
    });
  });

  describe('verifyEmail', () => {
    const mockToken = 'email-verification-token';

    it('should verify email successfully', async () => {
      const mockResponse = {
        message: 'Email verified successfully',
        success: true,
      };
      mockedHttpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.verifyEmail(mockToken);

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: `/api/auth/verify?token=${mockToken}`,
        typeCheck: expect.any(Function),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle verification failure', async () => {
      const mockResponse = {
        message: 'Email verification failed',
        success: false,
      };
      mockedHttpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.verifyEmail(mockToken);

      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(false);
    });

    it('should handle invalid verification token', async () => {
      const mockError = new Error('Invalid verification token');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(authService.verifyEmail(mockToken)).rejects.toThrow(
        'Invalid verification token',
      );
    });

    it('should handle expired verification token', async () => {
      const mockError = new Error('Verification token expired');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(authService.verifyEmail(mockToken)).rejects.toThrow(
        'Verification token expired',
      );
    });

    it('should handle empty token', async () => {
      const mockError = new Error('Verification token is required');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(authService.verifyEmail('')).rejects.toThrow(
        'Verification token is required',
      );
    });
  });

  describe('error scenarios', () => {
    it('should handle network timeout', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockedHttpClient.post.mockRejectedValueOnce(timeoutError);

      await expect(
        authService.signIn({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('Request timeout');
    });

    it('should handle server errors', async () => {
      const serverError = new Error('Internal server error');
      mockedHttpClient.post.mockRejectedValueOnce(serverError);

      await expect(
        authService.signUp({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          username: 'testuser',
          roles: [ROLES.USER],
        }),
      ).rejects.toThrow('Internal server error');
    });

    it('should handle connection errors', async () => {
      const connectionError = new Error('Connection refused');
      mockedHttpClient.get.mockRejectedValueOnce(connectionError);

      await expect(authService.verifyEmail('token')).rejects.toThrow(
        'Connection refused',
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete sign up and verification flow', async () => {
      // First, sign up
      const signUpData: SignUpRequest = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        username: 'newuser',
        roles: [ROLES.USER],
      };

      const mockUser = createMockUser({
        email: signUpData.email,
        name: signUpData.name,
        username: signUpData.username,
      });

      mockedHttpClient.post.mockResolvedValueOnce(mockUser);

      const signUpResult = await authService.signUp(signUpData);
      expect(signUpResult.name).toBe('New User');

      // Then verify email
      const verificationResponse = {
        message: 'Email verified successfully',
        success: true,
      };

      mockedHttpClient.get.mockResolvedValueOnce(verificationResponse);

      const verifyResult = await authService.verifyEmail('verification-token');
      expect(verifyResult.success).toBe(true);
    });

    it('should handle sign in and token refresh flow', async () => {
      // First, sign in
      const signInData: SignInRequest = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockAuthResponse = createMockAuthResponse();
      mockedHttpClient.post.mockResolvedValueOnce(mockAuthResponse);

      const signInResult = await authService.signIn(signInData);
      expect(signInResult.data.accessToken).toBeDefined();

      // Then refresh token
      const newAuthResponse = createMockAuthResponse({
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      });

      mockedHttpClient.post.mockResolvedValueOnce(newAuthResponse);

      const refreshResult = await authService.refreshToken(
        signInResult.data.refreshToken,
      );
      expect(refreshResult.data.accessToken).toBe('new-access-token');
    });
  });
});
