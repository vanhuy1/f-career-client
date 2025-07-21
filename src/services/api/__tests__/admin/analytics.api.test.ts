import { analyticsService } from '@/services/api/admin/analytics.api';
import { httpClient } from '@/utils/axios';
import { AnalyticsResponse } from '@/types/admin/Analytics';
import {
  UserAnalyticsResponse,
  UserAnalyticsParams,
} from '@/types/admin/UserAnalytics';
import {
  JobAnalyticsResponse,
  JobAnalyticsParams,
} from '@/types/admin/JobAnalytics';
import {
  ApplicationAnalyticsResponse,
  ApplicationAnalyticsParams,
} from '@/types/admin/ApplicationAnalytics';
import {
  CompanyAnalyticsResponse,
  CompanyAnalyticsParams,
} from '@/types/admin/ComanyAnalytics';

// Mock the httpClient
jest.mock('@/utils/axios', () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

// Mock the RequestBuilder to avoid dependencies
jest.mock('@/utils/axios/request-builder', () => ({
  RequestBuilder: jest.fn().mockImplementation(() => ({
    setResourcePath: jest.fn().mockReturnThis(),
    buildUrl: jest.fn((path: string) => `/api/admin/analytics/${path}`),
  })),
}));

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('AnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardAnalytics', () => {
    it('should fetch dashboard analytics successfully', async () => {
      const mockAnalyticsResponse: AnalyticsResponse = {
        totalUsers: 1000,
        totalJobs: 250,
        totalApplications: 1500,
        totalCompanies: 75,
        activeUsers: 850,
        activeJobs: 200,
        pendingApplications: 300,
        verifiedCompanies: 65,
      };

      mockedHttpClient.get.mockResolvedValueOnce(mockAnalyticsResponse);

      const result = await analyticsService.getDashboardAnalytics();

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/analytics/dashboard',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockAnalyticsResponse);
    });

    it('should handle dashboard analytics fetch errors', async () => {
      const mockError = new Error('Failed to fetch dashboard analytics');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(analyticsService.getDashboardAnalytics()).rejects.toThrow(
        'Failed to fetch dashboard analytics',
      );
    });

    it('should handle server errors for dashboard analytics', async () => {
      const serverError = new Error('Internal server error');
      mockedHttpClient.get.mockRejectedValueOnce(serverError);

      await expect(analyticsService.getDashboardAnalytics()).rejects.toThrow(
        'Internal server error',
      );
    });
  });

  describe('getUserAnalytics', () => {
    const mockUserAnalyticsParams: UserAnalyticsParams = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      interval: 'daily',
    };

    it('should fetch user analytics successfully', async () => {
      const mockUserAnalyticsResponse: UserAnalyticsResponse = {
        totalUsers: 1000,
        newUsers: 150,
        activeUsers: 850,
        userGrowthRate: 15.5,
        usersByInterval: [
          { date: '2024-01-01', count: 950 },
          { date: '2024-01-02', count: 960 },
        ],
        usersByRole: {
          candidates: 800,
          recruiters: 200,
        },
      };

      mockedHttpClient.get.mockResolvedValueOnce(mockUserAnalyticsResponse);

      const result = await analyticsService.getUserAnalytics(
        mockUserAnalyticsParams,
      );

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/analytics/users?startDate=2024-01-01&endDate=2024-01-31&interval=daily',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockUserAnalyticsResponse);
    });

    it('should handle user analytics fetch errors', async () => {
      const mockError = new Error('Failed to fetch user analytics');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        analyticsService.getUserAnalytics(mockUserAnalyticsParams),
      ).rejects.toThrow('Failed to fetch user analytics');
    });

    it('should handle invalid date range for user analytics', async () => {
      const invalidParams: UserAnalyticsParams = {
        startDate: '2024-01-31',
        endDate: '2024-01-01', // End date before start date
        interval: 'daily',
      };

      const mockError = new Error('Invalid date range');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        analyticsService.getUserAnalytics(invalidParams),
      ).rejects.toThrow('Invalid date range');
    });

    it('should construct URL with special characters in query params', async () => {
      const specialParams: UserAnalyticsParams = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        interval: 'weekly',
      };

      const mockResponse: UserAnalyticsResponse = {
        totalUsers: 500,
        newUsers: 50,
        activeUsers: 450,
        userGrowthRate: 10.0,
        usersByInterval: [],
        usersByRole: { candidates: 400, recruiters: 100 },
      };

      mockedHttpClient.get.mockResolvedValueOnce(mockResponse);

      await analyticsService.getUserAnalytics(specialParams);

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/analytics/users?startDate=2024-01-01&endDate=2024-01-31&interval=weekly',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
    });
  });

  describe('getJobAnalytics', () => {
    const mockJobAnalyticsParams: JobAnalyticsParams = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      interval: 'monthly',
    };

    it('should fetch job analytics successfully', async () => {
      const mockJobAnalyticsResponse: JobAnalyticsResponse = {
        totalJobs: 250,
        activeJobs: 200,
        newJobs: 25,
        jobsByCategory: {
          'Software Development': 100,
          'Data Science': 50,
          Design: 30,
          Marketing: 70,
        },
        jobsByInterval: [
          { date: '2024-01-01', count: 225 },
          { date: '2024-01-31', count: 250 },
        ],
        averageJobsPerCompany: 3.3,
      };

      mockedHttpClient.get.mockResolvedValueOnce(mockJobAnalyticsResponse);

      const result = await analyticsService.getJobAnalytics(
        mockJobAnalyticsParams,
      );

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/analytics/jobs?startDate=2024-01-01&endDate=2024-01-31&interval=monthly',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockJobAnalyticsResponse);
    });

    it('should handle job analytics fetch errors', async () => {
      const mockError = new Error('Failed to fetch job analytics');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        analyticsService.getJobAnalytics(mockJobAnalyticsParams),
      ).rejects.toThrow('Failed to fetch job analytics');
    });

    it('should handle network timeout for job analytics', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockedHttpClient.get.mockRejectedValueOnce(timeoutError);

      await expect(
        analyticsService.getJobAnalytics(mockJobAnalyticsParams),
      ).rejects.toThrow('Request timeout');
    });
  });

  describe('getApplicationAnalytics', () => {
    const mockApplicationAnalyticsParams: ApplicationAnalyticsParams = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      interval: 'weekly',
    };

    it('should fetch application analytics successfully', async () => {
      const mockApplicationAnalyticsResponse: ApplicationAnalyticsResponse = {
        totalApplications: 1500,
        pendingApplications: 300,
        acceptedApplications: 450,
        rejectedApplications: 750,
        applicationsByStatus: {
          pending: 300,
          reviewing: 200,
          accepted: 450,
          rejected: 550,
        },
        applicationsByInterval: [
          { date: '2024-01-01', count: 1400 },
          { date: '2024-01-07', count: 1450 },
          { date: '2024-01-14', count: 1480 },
          { date: '2024-01-21', count: 1500 },
        ],
        averageApplicationsPerJob: 6.0,
        conversionRate: 30.0,
      };

      mockedHttpClient.get.mockResolvedValueOnce(
        mockApplicationAnalyticsResponse,
      );

      const result = await analyticsService.getApplicationAnalytics(
        mockApplicationAnalyticsParams,
      );

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/analytics/applications?startDate=2024-01-01&endDate=2024-01-31&interval=weekly',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockApplicationAnalyticsResponse);
    });

    it('should handle application analytics fetch errors', async () => {
      const mockError = new Error('Failed to fetch application analytics');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        analyticsService.getApplicationAnalytics(
          mockApplicationAnalyticsParams,
        ),
      ).rejects.toThrow('Failed to fetch application analytics');
    });

    it('should handle malformed response data', async () => {
      const malformedError = new Error('Malformed response data');
      mockedHttpClient.get.mockRejectedValueOnce(malformedError);

      await expect(
        analyticsService.getApplicationAnalytics(
          mockApplicationAnalyticsParams,
        ),
      ).rejects.toThrow('Malformed response data');
    });
  });

  describe('getCompanyAnalytics', () => {
    const mockCompanyAnalyticsParams: CompanyAnalyticsParams = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      interval: 'daily',
    };

    it('should fetch company analytics successfully', async () => {
      const mockCompanyAnalyticsResponse: CompanyAnalyticsResponse = {
        totalCompanies: 75,
        verifiedCompanies: 65,
        newCompanies: 8,
        activeCompanies: 60,
        companiesBySize: {
          startup: 30,
          small: 25,
          medium: 15,
          large: 5,
        },
        companiesByInterval: [
          { date: '2024-01-01', count: 67 },
          { date: '2024-01-15', count: 71 },
          { date: '2024-01-31', count: 75 },
        ],
        companiesByIndustry: {
          Technology: 40,
          Healthcare: 15,
          Finance: 10,
          Education: 10,
        },
        averageJobsPerCompany: 3.3,
      };

      mockedHttpClient.get.mockResolvedValueOnce(mockCompanyAnalyticsResponse);

      const result = await analyticsService.getCompanyAnalytics(
        mockCompanyAnalyticsParams,
      );

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/analytics/companies?startDate=2024-01-01&endDate=2024-01-31&interval=daily',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
      expect(result).toEqual(mockCompanyAnalyticsResponse);
    });

    it('should handle company analytics fetch errors', async () => {
      const mockError = new Error('Failed to fetch company analytics');
      mockedHttpClient.get.mockRejectedValueOnce(mockError);

      await expect(
        analyticsService.getCompanyAnalytics(mockCompanyAnalyticsParams),
      ).rejects.toThrow('Failed to fetch company analytics');
    });

    it('should handle unauthorized access errors', async () => {
      const unauthorizedError = new Error('Unauthorized access');
      mockedHttpClient.get.mockRejectedValueOnce(unauthorizedError);

      await expect(
        analyticsService.getCompanyAnalytics(mockCompanyAnalyticsParams),
      ).rejects.toThrow('Unauthorized access');
    });
  });

  describe('error scenarios', () => {
    it('should handle network connectivity issues', async () => {
      const networkError = new Error('Network unavailable');
      mockedHttpClient.get.mockRejectedValueOnce(networkError);

      await expect(analyticsService.getDashboardAnalytics()).rejects.toThrow(
        'Network unavailable',
      );
    });

    it('should handle service unavailable errors', async () => {
      const serviceError = new Error('Service temporarily unavailable');
      mockedHttpClient.get.mockRejectedValueOnce(serviceError);

      const params: UserAnalyticsParams = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        interval: 'daily',
      };

      await expect(analyticsService.getUserAnalytics(params)).rejects.toThrow(
        'Service temporarily unavailable',
      );
    });

    it('should handle rate limiting errors', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      mockedHttpClient.get.mockRejectedValueOnce(rateLimitError);

      const params: JobAnalyticsParams = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        interval: 'monthly',
      };

      await expect(analyticsService.getJobAnalytics(params)).rejects.toThrow(
        'Rate limit exceeded',
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple analytics requests in sequence', async () => {
      // Mock responses for different analytics
      const mockDashboard: AnalyticsResponse = {
        totalUsers: 1000,
        totalJobs: 250,
        totalApplications: 1500,
        totalCompanies: 75,
        activeUsers: 850,
        activeJobs: 200,
        pendingApplications: 300,
        verifiedCompanies: 65,
      };

      const mockUserAnalytics: UserAnalyticsResponse = {
        totalUsers: 1000,
        newUsers: 150,
        activeUsers: 850,
        userGrowthRate: 15.5,
        usersByInterval: [],
        usersByRole: { candidates: 800, recruiters: 200 },
      };

      mockedHttpClient.get
        .mockResolvedValueOnce(mockDashboard)
        .mockResolvedValueOnce(mockUserAnalytics);

      // Execute multiple requests
      const dashboardResult = await analyticsService.getDashboardAnalytics();
      const userResult = await analyticsService.getUserAnalytics({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        interval: 'daily',
      });

      expect(dashboardResult.totalUsers).toBe(1000);
      expect(userResult.totalUsers).toBe(1000);
      expect(mockedHttpClient.get).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent analytics requests', async () => {
      const mockResponses = {
        dashboard: {
          totalUsers: 1000,
          totalJobs: 250,
          totalApplications: 1500,
          totalCompanies: 75,
          activeUsers: 850,
          activeJobs: 200,
          pendingApplications: 300,
          verifiedCompanies: 65,
        },
        jobs: {
          totalJobs: 250,
          activeJobs: 200,
          newJobs: 25,
          jobsByCategory: {},
          jobsByInterval: [],
          averageJobsPerCompany: 3.3,
        },
        applications: {
          totalApplications: 1500,
          pendingApplications: 300,
          acceptedApplications: 450,
          rejectedApplications: 750,
          applicationsByStatus: {},
          applicationsByInterval: [],
          averageApplicationsPerJob: 6.0,
          conversionRate: 30.0,
        },
      };

      mockedHttpClient.get
        .mockResolvedValueOnce(mockResponses.dashboard)
        .mockResolvedValueOnce(mockResponses.jobs)
        .mockResolvedValueOnce(mockResponses.applications);

      const params = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        interval: 'daily' as const,
      };

      // Execute concurrent requests
      const [dashboardResult, jobsResult, applicationsResult] =
        await Promise.all([
          analyticsService.getDashboardAnalytics(),
          analyticsService.getJobAnalytics(params),
          analyticsService.getApplicationAnalytics(params),
        ]);

      expect(dashboardResult.totalUsers).toBe(1000);
      expect(jobsResult.totalJobs).toBe(250);
      expect(applicationsResult.totalApplications).toBe(1500);
      expect(mockedHttpClient.get).toHaveBeenCalledTimes(3);
    });
  });

  describe('typeCheck function validation', () => {
    it('should validate typeCheck function is called correctly', async () => {
      const mockResponse = {
        totalUsers: 1000,
        totalJobs: 250,
        totalApplications: 1500,
        totalCompanies: 75,
        activeUsers: 850,
        activeJobs: 200,
        pendingApplications: 300,
        verifiedCompanies: 65,
      };

      mockedHttpClient.get.mockImplementation(async ({ typeCheck }) => {
        // Simulate calling the typeCheck function
        const result = typeCheck(mockResponse);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockResponse);
        return mockResponse;
      });

      await analyticsService.getDashboardAnalytics();

      expect(mockedHttpClient.get).toHaveBeenCalledWith({
        url: '/api/admin/analytics/dashboard',
        typeCheck: expect.any(Function),
        config: {
          withCredentials: false,
        },
      });
    });
  });
});
