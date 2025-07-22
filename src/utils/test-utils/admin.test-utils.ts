import { User } from '@/types/admin/UserManagement';
import { UserAnalyticsData } from '@/types/admin/UserAnalytics';
import { ROLES } from '@/enums/roles.enum';

// Mock user data factory
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  email: 'john.doe@example.com',
  roles: [ROLES.USER],
  isAccountDisabled: false,
  gender: 'Male',
  phone: '+1234567890',
  avatar: 'https://example.com/avatar.jpg',
  dob: '1990-05-15',
  createdAt: '2023-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  companyId: 'company-123',
  ...overrides,
});

// Mock analytics data factory
export const createMockUserAnalyticsData = (
  overrides: Partial<UserAnalyticsData> = {},
): UserAnalyticsData => ({
  registrationTrends: [
    {
      date: '2024-01-01',
      registrations: 50,
      localRegistrations: 30,
      googleRegistrations: 20,
    },
    {
      date: '2024-01-02',
      registrations: 45,
      localRegistrations: 25,
      googleRegistrations: 20,
    },
  ],
  demographics: {
    userByRoles: [
      { name: 'User', count: 150, percentage: 75 },
      { name: 'Recruiter', count: 50, percentage: 25 },
    ],
    userByProvider: [
      { name: 'Local', count: 120, percentage: 60 },
      { name: 'Google', count: 80, percentage: 40 },
    ],
    userByAccountStatus: [
      { name: 'Active', count: 180, percentage: 90 },
      { name: 'Disabled', count: 20, percentage: 10 },
    ],
    userByGender: [
      { name: 'Male', count: 100, percentage: 50 },
      { name: 'Female', count: 100, percentage: 50 },
    ],
  },
  activityMetrics: {
    activeUsersLast30Days: 120,
    accountVerificationRate: 85.5,
    averageProfileCompletionRate: 72.3,
    usersWithCompleteProfiles: 90,
    activeJobSeekers: 75,
  },
  ...overrides,
});

// Common test scenarios
export const testScenarios = {
  users: {
    active: createMockUser({ isAccountDisabled: false }),
    disabled: createMockUser({ isAccountDisabled: true, id: 2 }),
    admin: createMockUser({ roles: [ROLES.ADMIN], id: 3 }),
    recruiter: createMockUser({ roles: [ROLES.RECRUITER], id: 4 }),
    multiRole: createMockUser({ roles: [ROLES.USER, ROLES.RECRUITER], id: 5 }),
    withoutOptionalFields: createMockUser({
      phone: null,
      dob: null,
      gender: null,
      companyId: null,
      avatar: null,
      id: 6,
    }),
  },
};

// Common mock implementations
export const mockImplementations = {
  // Delayed response for testing loading states
  delayedResponse: <T>(data: T, delay: number = 100): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(data), delay)),

  // Error response for testing error states
  errorResponse: (message: string = 'Network error'): Promise<never> =>
    Promise.reject(new Error(message)),

  // Progressive responses (first fails, then succeeds)
  progressiveResponse: <T>(data: T, errorMessage: string = 'Network error') => {
    let callCount = 0;
    return jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error(errorMessage));
      }
      return Promise.resolve(data);
    });
  },
};

// Common assertions
export const commonAssertions = {
  // Check if loading state is properly displayed
  expectLoadingState: (screen: any) => {
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  },

  // Check if error state is properly displayed
  expectErrorState: (screen: any, errorMessage?: string) => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    if (errorMessage) {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  },

  // Check if user information is displayed correctly
  expectUserInfo: (screen: any, user: User) => {
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(`@${user.username}`)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();

    const statusText = user.isAccountDisabled ? 'Disabled' : 'Active';
    expect(screen.getByText(statusText)).toBeInTheDocument();
  },

  // Check if analytics metrics are displayed correctly
  expectAnalyticsMetrics: (screen: any, data: UserAnalyticsData) => {
    expect(
      screen.getByText(data.activityMetrics.activeUsersLast30Days.toString()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${data.activityMetrics.accountVerificationRate.toFixed(1)}%`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${data.activityMetrics.averageProfileCompletionRate.toFixed(1)}%`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        data.activityMetrics.usersWithCompleteProfiles.toString(),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(data.activityMetrics.activeJobSeekers.toString()),
    ).toBeInTheDocument();
  },
};

// Date formatting utilities for testing
export const dateTestUtils = {
  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  formatDateTime: (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

// Mock router factory
export const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
});

// Mock params factory
export const createMockParams = (id: string = '1') => ({ id });

// Chart.js mock components
export const mockChartComponents = {
  Bar: ({ data, options }: any) => ({
    type: 'div',
    props: {
      'data-testid': 'bar-chart',
      'data-chart-data': JSON.stringify(data),
      'data-chart-options': JSON.stringify(options),
      children: 'Bar Chart',
    },
  }),
  Pie: ({ data, options }: any) => ({
    type: 'div',
    props: {
      'data-testid': 'pie-chart',
      'data-chart-data': JSON.stringify(data),
      'data-chart-options': JSON.stringify(options),
      children: 'Pie Chart',
    },
  }),
};

// Common mock setups
export const setupMocks = {
  chartjs: () => {
    jest.mock('react-chartjs-2', () => mockChartComponents);
    jest.mock('chart.js', () => ({
      Chart: { register: jest.fn() },
      CategoryScale: jest.fn(),
      LinearScale: jest.fn(),
      BarElement: jest.fn(),
      Title: jest.fn(),
      Tooltip: jest.fn(),
      Legend: jest.fn(),
      ArcElement: jest.fn(),
    }));
  },

  navigation: () => {
    jest.mock('next/navigation', () => ({
      useRouter: jest.fn(),
      useParams: jest.fn(),
    }));
  },

  analyticsService: () => {
    jest.mock('@/services/api/admin/analytics.api', () => ({
      analyticsService: {
        getUserAnalytics: jest.fn(),
      },
    }));
  },

  userManagementService: () => {
    jest.mock('@/services/api/admin/user-mgm.api', () => ({
      userManagementService: {
        getUserDetail: jest.fn(),
        updateUserStatus: jest.fn(),
      },
    }));
  },
};
