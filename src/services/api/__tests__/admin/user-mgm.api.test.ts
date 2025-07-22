import { userManagementService } from '@/services/api/admin/user-mgm.api';
import { httpClient } from '@/utils/axios';
import {
  User,
  UserManagementRequest,
  UserResponse,
  UserStatusRequest,
  UserDetailResponse,
} from '@/types/admin/UserManagement';
import { ROLES } from '@/enums/roles.enum';

// Mock the httpClient
jest.mock('@/utils/axios', () => ({
  httpClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

// Mock the RequestBuilder to avoid dependencies
jest.mock('@/utils/axios/request-builder', () => ({
  RequestBuilder: jest.fn().mockImplementation(() => ({
    setResourcePath: jest.fn().mockReturnThis(),
    buildUrl: jest.fn((path: string) => `/api/admin/users/${path}`),
  })),
}));

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('UserManagementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    const mockUserManagementRequest: UserManagementRequest = {
      limit: 10,
      offset: 0,
    };

    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      roles: [ROLES.USER],
      isAccountDisabled: false,
      gender: 'male',
      phone: '+1234567890',
      avatar: 'https://example.com/avatar.jpg',
      dob: '1990-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      companyId: null,
    };

    const mockUserResponse: UserResponse = {
      data: {
        users: [mockUser],
        count: 1,
        limit: 10,
        offset: 0,
      },
      meta: {
        apiVersion: '1.0.0',
      },
    };

    it('should fetch users successfully', async () => {
      mockedHttpClient.get.mockResolvedValueOnce(mockUserResponse);

      const result = await userManagementService.getUsers(
        mockUserManagementRequest,
      );

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/users/',
        typeCheck: expect.any(Function),
        config: {
          params: {
            limit: mockUserManagementRequest.limit,
            offset: mockUserManagementRequest.offset,
          },
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockUserResponse);
    });

    it('should handle users fetch errors', async () => {
      const mockError = new Error('Failed to fetch users');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        userManagementService.getUsers(mockUserManagementRequest),
      ).rejects.toThrow('Failed to fetch users');
    });

    it('should handle server errors for users fetch', async () => {
      const serverError = new Error('Internal server error');
      mockedHttpClient.get.mockRejectedValueOnce(serverError);

      await expect(
        userManagementService.getUsers(mockUserManagementRequest),
      ).rejects.toThrow('Internal server error');
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockedHttpClient.get.mockRejectedValueOnce(timeoutError);

      await expect(
        userManagementService.getUsers(mockUserManagementRequest),
      ).rejects.toThrow('Request timeout');
    });

    it('should handle unauthorized access errors', async () => {
      const unauthorizedError = new Error('Unauthorized access');
      mockedHttpClient.get.mockRejectedValueOnce(unauthorizedError);

      await expect(
        userManagementService.getUsers(mockUserManagementRequest),
      ).rejects.toThrow('Unauthorized access');
    });

    it('should handle pagination parameters correctly', async () => {
      const paginationRequest: UserManagementRequest = {
        limit: 50,
        offset: 100,
      };

      const mockResponse: UserResponse = {
        data: {
          users: [],
          count: 0,
          limit: 50,
          offset: 100,
        },
        meta: {
          apiVersion: '1.0.0',
        },
      };

      mockedHttpClient.get.mockResolvedValueOnce(mockResponse);

      await userManagementService.getUsers(paginationRequest);

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/users/',
        typeCheck: expect.any(Function),
        config: {
          params: {
            limit: 50,
            offset: 100,
          },
          withCredentials: false,
        },
      });
    });
  });

  describe('getUserDetail', () => {
    const userId = '123';
    const mockUser: User = {
      id: 123,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane.smith@example.com',
      roles: [ROLES.RECRUITER],
      isAccountDisabled: false,
      gender: 'female',
      phone: '+1987654321',
      avatar: 'https://example.com/jane-avatar.jpg',
      dob: '1985-05-15',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      companyId: 'company-456',
    };

    const mockUserDetailResponse: UserDetailResponse = {
      data: mockUser,
      meta: {
        apiVersion: '1.0.0',
      },
    };

    it('should fetch user detail successfully', async () => {
      mockedHttpClient.get.mockResolvedValueOnce(mockUserDetailResponse);

      const result = await userManagementService.getUserDetail(userId);

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/users/123',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle user detail fetch errors', async () => {
      const mockError = new Error('Failed to fetch user detail');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(userManagementService.getUserDetail(userId)).rejects.toThrow(
        'Failed to fetch user detail',
      );
    });

    it('should handle user not found errors', async () => {
      const notFoundError = new Error('User not found');
      mockedHttpClient.get.mockRejectedValueOnce(notFoundError);

      await expect(
        userManagementService.getUserDetail('non-existent-id'),
      ).rejects.toThrow('User not found');
    });

    it('should handle malformed user ID', async () => {
      const invalidIdError = new Error('Invalid user ID format');
      mockedHttpClient.get.mockRejectedValueOnce(invalidIdError);

      await expect(
        userManagementService.getUserDetail('invalid-id'),
      ).rejects.toThrow('Invalid user ID format');
    });

    it('should handle empty user ID', async () => {
      const emptyIdError = new Error('User ID is required');
      mockedHttpClient.get.mockRejectedValueOnce(emptyIdError);

      await expect(userManagementService.getUserDetail('')).rejects.toThrow(
        'User ID is required',
      );
    });

    it('should handle network connectivity issues', async () => {
      const networkError = new Error('Network unavailable');
      mockedHttpClient.get.mockRejectedValueOnce(networkError);

      await expect(userManagementService.getUserDetail(userId)).rejects.toThrow(
        'Network unavailable',
      );
    });
  });

  describe('updateUserStatus', () => {
    const mockUserStatusRequest: UserStatusRequest = {
      id: '456',
      isAccountDisabled: true,
    };

    const mockUpdatedUser: User = {
      id: 456,
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob.johnson@example.com',
      roles: [ROLES.USER],
      isAccountDisabled: true,
      gender: null,
      phone: null,
      avatar: null,
      dob: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
      companyId: null,
    };

    it('should update user status successfully', async () => {
      mockedHttpClient.patch.mockResolvedValueOnce(mockUpdatedUser);

      const result = await userManagementService.updateUserStatus(
        mockUserStatusRequest,
      );

      expect(mockedHttpClient.patch).toHaveBeenCalledWith({
        url: '/api/admin/users/456/status',
        body: mockUserStatusRequest,
        typeCheck: expect.any(Function),
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should handle user status update errors', async () => {
      const mockError = new Error('Failed to update user status');
      mockedHttpClient.patch.mockRejectedValueOnce(mockError);

      await expect(
        userManagementService.updateUserStatus(mockUserStatusRequest),
      ).rejects.toThrow('Failed to update user status');
    });

    it('should handle user not found for status update', async () => {
      const notFoundError = new Error('User not found for status update');
      mockedHttpClient.patch.mockRejectedValueOnce(notFoundError);

      await expect(
        userManagementService.updateUserStatus({
          id: 'non-existent-id',
          isAccountDisabled: false,
        }),
      ).rejects.toThrow('User not found for status update');
    });

    it('should handle forbidden access for status update', async () => {
      const forbiddenError = new Error('Forbidden: Insufficient permissions');
      mockedHttpClient.patch.mockRejectedValueOnce(forbiddenError);

      await expect(
        userManagementService.updateUserStatus(mockUserStatusRequest),
      ).rejects.toThrow('Forbidden: Insufficient permissions');
    });

    it('should handle validation errors for status update', async () => {
      const validationError = new Error('Invalid status value');
      mockedHttpClient.patch.mockRejectedValueOnce(validationError);

      const invalidRequest: UserStatusRequest = {
        id: '456',
        isAccountDisabled: true,
      };

      await expect(
        userManagementService.updateUserStatus(invalidRequest),
      ).rejects.toThrow('Invalid status value');
    });

    it('should update user status to enabled', async () => {
      const enableRequest: UserStatusRequest = {
        id: '789',
        isAccountDisabled: false,
      };

      const enabledUser: User = {
        ...mockUpdatedUser,
        id: 789,
        isAccountDisabled: false,
      };

      mockedHttpClient.patch.mockResolvedValueOnce(enabledUser);

      const result =
        await userManagementService.updateUserStatus(enableRequest);

      expect(mockedHttpClient.patch).toHaveBeenCalledWith({
        url: '/api/admin/users/789/status',
        body: enableRequest,
        typeCheck: expect.any(Function),
      });
      expect(result.isAccountDisabled).toBe(false);
    });

    it('should handle concurrent status updates', async () => {
      const concurrentError = new Error('Concurrent modification detected');
      mockedHttpClient.patch.mockRejectedValueOnce(concurrentError);

      await expect(
        userManagementService.updateUserStatus(mockUserStatusRequest),
      ).rejects.toThrow('Concurrent modification detected');
    });
  });

  describe('error scenarios', () => {
    it('should handle rate limiting errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      mockedHttpClient.get.mockRejectedValueOnce(rateLimitError);

      const request: UserManagementRequest = {
        limit: 10,
        offset: 0,
      };

      await expect(userManagementService.getUsers(request)).rejects.toThrow(
        'Rate limit exceeded',
      );
    });

    it('should handle service unavailable errors', async () => {
      const serviceError = new Error('Service temporarily unavailable');
      mockedHttpClient.get.mockRejectedValueOnce(serviceError);

      await expect(userManagementService.getUserDetail('123')).rejects.toThrow(
        'Service temporarily unavailable',
      );
    });

    it('should handle CORS errors', async () => {
      const corsError = new Error('CORS policy violation');
      mockedHttpClient.patch.mockRejectedValueOnce(corsError);

      const request: UserStatusRequest = {
        id: '123',
        isAccountDisabled: false,
      };

      await expect(
        userManagementService.updateUserStatus(request),
      ).rejects.toThrow('CORS policy violation');
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple user management operations in sequence', async () => {
      const mockUserResponse: UserResponse = {
        data: {
          users: [
            {
              id: 1,
              name: 'User 1',
              username: 'user1',
              email: 'user1@example.com',
              roles: [ROLES.USER],
              isAccountDisabled: false,
              gender: null,
              phone: null,
              avatar: null,
              dob: null,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              companyId: null,
            },
          ],
          count: 1,
          limit: 10,
          offset: 0,
        },
        meta: { apiVersion: '1.0.0' },
      };

      const mockUserDetail: UserDetailResponse = {
        data: {
          id: 1,
          name: 'User 1 Detail',
          username: 'user1',
          email: 'user1@example.com',
          roles: [ROLES.USER],
          isAccountDisabled: false,
          gender: 'male',
          phone: '+1234567890',
          avatar: 'avatar.jpg',
          dob: '1990-01-01',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          companyId: null,
        },
        meta: { apiVersion: '1.0.0' },
      };

      const mockUpdatedUser: User = {
        ...mockUserDetail.data,
        isAccountDisabled: true,
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockedHttpClient.get
        .mockResolvedValueOnce(mockUserResponse)
        .mockResolvedValueOnce(mockUserDetail);
      mockedHttpClient.patch.mockResolvedValueOnce(mockUpdatedUser);

      // Execute multiple operations
      const usersResult = await userManagementService.getUsers({
        limit: 10,
        offset: 0,
      });
      const userDetailResult = await userManagementService.getUserDetail('1');
      const updateResult = await userManagementService.updateUserStatus({
        id: '1',
        isAccountDisabled: true,
      });

      expect(usersResult.data.users).toHaveLength(1);
      expect(userDetailResult.name).toBe('User 1 Detail');
      expect(updateResult.isAccountDisabled).toBe(true);
      expect(mockedHttpClient.get).toHaveBeenCalledTimes(2);
      expect(mockedHttpClient.patch).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent user management requests', async () => {
      const mockResponses = {
        users: {
          data: {
            users: [],
            count: 0,
            limit: 10,
            offset: 0,
          },
          meta: { apiVersion: '1.0.0' },
        },
        userDetail: {
          data: {
            id: 1,
            name: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            roles: [ROLES.USER],
            isAccountDisabled: false,
            gender: null,
            phone: null,
            avatar: null,
            dob: null,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            companyId: null,
          },
          meta: { apiVersion: '1.0.0' },
        },
      };

      mockedHttpClient.get
        .mockResolvedValueOnce(mockResponses.users)
        .mockResolvedValueOnce(mockResponses.userDetail);

      // Execute concurrent requests
      const [usersResult, userDetailResult] = await Promise.all([
        userManagementService.getUsers({ limit: 10, offset: 0 }),
        userManagementService.getUserDetail('1'),
      ]);

      expect(usersResult.data.count).toBe(0);
      expect(userDetailResult.name).toBe('Test User');
      expect(mockedHttpClient.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('typeCheck function validation', () => {
    it('should validate typeCheck function for getUsers', async () => {
      const mockResponse: UserResponse = {
        data: {
          users: [],
          count: 0,
          limit: 10,
          offset: 0,
        },
        meta: { apiVersion: '1.0.0' },
      };

      mockedHttpClient.get.mockImplementation(async ({ typeCheck }) => {
        const result = typeCheck(mockResponse);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockResponse);
        return mockResponse;
      });

      await userManagementService.getUsers({ limit: 10, offset: 0 });

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/users/',
        typeCheck: expect.any(Function),
        config: {
          params: { limit: 10, offset: 0 },
          withCredentials: false,
        },
      });
    });

    it('should validate typeCheck function for getUserDetail', async () => {
      const mockResponse: UserDetailResponse = {
        data: {
          id: 1,
          name: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          roles: [ROLES.USER],
          isAccountDisabled: false,
          gender: null,
          phone: null,
          avatar: null,
          dob: null,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          companyId: null,
        },
        meta: { apiVersion: '1.0.0' },
      };

      mockedHttpClient.get.mockImplementation(async ({ typeCheck }) => {
        const result = typeCheck(mockResponse);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockResponse);
        return mockResponse;
      });

      await userManagementService.getUserDetail('1');

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/users/1',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
    });

    it('should validate typeCheck function for updateUserStatus', async () => {
      const mockResponse: User = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        roles: [ROLES.USER],
        isAccountDisabled: true,
        gender: null,
        phone: null,
        avatar: null,
        dob: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        companyId: null,
      };

      mockedHttpClient.patch.mockImplementation(async ({ typeCheck }) => {
        const result = typeCheck(mockResponse);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockResponse);
        return mockResponse;
      });

      await userManagementService.updateUserStatus({
        id: '1',
        isAccountDisabled: true,
      });

      expect(mockedHttpClient.patch).toHaveBeenCalledWith({
        url: '/api/admin/users/1/status',
        body: { id: '1', isAccountDisabled: true },
        typeCheck: expect.any(Function),
      });
    });
  });
});
