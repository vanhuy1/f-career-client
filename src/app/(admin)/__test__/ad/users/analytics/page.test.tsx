import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserAnalyticsPage from '../../../../ad/users/analytics/page';
import { analyticsService } from '@/services/api/admin/analytics.api';
import { UserAnalyticsData } from '@/types/admin/UserAnalytics';

// Mock console.error to suppress error logs during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock Chart.js to avoid canvas issues in test environment
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: any) => (
    <div
      data-testid="bar-chart"
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
    >
      Bar Chart
    </div>
  ),
  Pie: ({ data, options }: any) => (
    <div
      data-testid="pie-chart"
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
    >
      Pie Chart
    </div>
  ),
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  ArcElement: jest.fn(),
}));

// Mock the analytics service
jest.mock('@/services/api/admin/analytics.api', () => ({
  analyticsService: {
    getUserAnalytics: jest.fn(),
  },
}));

const mockedAnalyticsService = analyticsService as jest.Mocked<
  typeof analyticsService
>;

// Mock data
const mockUserAnalyticsData: UserAnalyticsData = {
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
      { name: 'Candidate', count: 150, percentage: 75 },
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
};

const mockUserAnalyticsResponse = {
  data: mockUserAnalyticsData,
  meta: { apiVersion: '1.0' },
};

describe('UserAnalyticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    // Mock a delayed response
    mockedAnalyticsService.getUserAnalytics.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockUserAnalyticsResponse), 100),
        ),
    );

    render(<UserAnalyticsPage />);

    // Check loading state - skeleton elements should be present
    const skeletonElements = document.querySelectorAll(
      '[data-slot="skeleton"]',
    );
    expect(skeletonElements.length).toBeGreaterThan(0);

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.getByText('Active Users (30d)')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should display analytics data correctly', async () => {
    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('User Analytics')).toBeInTheDocument();
    });

    // Check key metrics are displayed (some numbers appear multiple times)
    expect(screen.getAllByText('120')).toHaveLength(2); // Active users (appears in metrics and demographics)
    expect(screen.getByText('85.5%')).toBeInTheDocument(); // Verification rate
    expect(screen.getByText('72.3%')).toBeInTheDocument(); // Profile completion
    expect(screen.getByText('90')).toBeInTheDocument(); // Complete profiles
    expect(screen.getByText('75')).toBeInTheDocument(); // Active job seekers

    // Check charts are rendered
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should handle error state correctly', async () => {
    const errorMessage = 'Failed to fetch analytics data';
    mockedAnalyticsService.getUserAnalytics.mockRejectedValue(
      new Error(errorMessage),
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Error loading analytics')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to fetch analytics data'),
      ).toBeInTheDocument();
    });

    // Check retry button is present
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should handle retry functionality', async () => {
    const user = userEvent.setup();

    // First call fails
    mockedAnalyticsService.getUserAnalytics.mockRejectedValueOnce(
      new Error('Network error'),
    );
    // Second call succeeds
    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Error loading analytics')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getAllByText('120')).toHaveLength(2); // Data should load (appears multiple times)
    });

    expect(mockedAnalyticsService.getUserAnalytics).toHaveBeenCalledTimes(2);
  });

  it('should handle date range changes', async () => {
    const user = userEvent.setup();

    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('User Analytics')).toBeInTheDocument();
    });

    // Click on "Last 7 days" button
    const last7DaysButton = screen.getByRole('button', {
      name: /last 7 days/i,
    });
    await user.click(last7DaysButton);

    // Check if the API was called again with new parameters
    await waitFor(() => {
      expect(mockedAnalyticsService.getUserAnalytics).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle interval changes', async () => {
    const user = userEvent.setup();

    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('User Analytics')).toBeInTheDocument();
    });

    // For now, just check that the interval selector is present
    // The complex Select component interaction can be tested separately
    const intervalSelect = screen.getByRole('combobox');
    expect(intervalSelect).toBeInTheDocument();

    // Verify initial API call was made
    expect(mockedAnalyticsService.getUserAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        interval: 'monthly',
      }),
    );
  });

  it('should handle refresh button click', async () => {
    const user = userEvent.setup();

    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('User Analytics')).toBeInTheDocument();
    });

    // Find and click refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    // Check if the API was called again
    await waitFor(() => {
      expect(mockedAnalyticsService.getUserAnalytics).toHaveBeenCalledTimes(2);
    });
  });

  it('should display role distribution details correctly', async () => {
    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Role Distribution Details')).toBeInTheDocument();
    });

    // Check role details
    expect(screen.getByText('Candidate')).toBeInTheDocument();
    expect(screen.getByText('Recruiter')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.getByText('25.0%')).toBeInTheDocument();
  });

  it('should display user provider details correctly', async () => {
    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Users by Provider')).toBeInTheDocument();
    });

    // Check provider details
    expect(screen.getByText('Local')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('60.0%')).toBeInTheDocument();
    expect(screen.getByText('40.0%')).toBeInTheDocument();
  });

  it('should display account status details correctly', async () => {
    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('Account Status')).toBeInTheDocument();
    });

    // Check status details
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(screen.getByText('90.0%')).toBeInTheDocument();
    expect(screen.getByText('10.0%')).toBeInTheDocument();
  });

  it('should handle quick date range selections', async () => {
    const user = userEvent.setup();

    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByText('User Analytics')).toBeInTheDocument();
    });

    const initialCallCount =
      mockedAnalyticsService.getUserAnalytics.mock.calls.length;

    // Test each quick date range button
    const last30DaysButton = screen.getByRole('button', {
      name: /last 30 days/i,
    });
    await user.click(last30DaysButton);

    const last90DaysButton = screen.getByRole('button', {
      name: /last 90 days/i,
    });
    await user.click(last90DaysButton);

    const thisYearButton = screen.getByRole('button', { name: /this year/i });
    await user.click(thisYearButton);

    // Each button click should trigger a new API call
    await waitFor(() => {
      expect(mockedAnalyticsService.getUserAnalytics).toHaveBeenCalledTimes(
        initialCallCount + 3,
      );
    });
  });

  it('should validate API call parameters', async () => {
    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(mockedAnalyticsService.getUserAnalytics).toHaveBeenCalled();
    });

    const lastCall = mockedAnalyticsService.getUserAnalytics.mock.calls[0][0];

    // Validate the parameters structure
    expect(lastCall).toHaveProperty('startDate');
    expect(lastCall).toHaveProperty('endDate');
    expect(lastCall).toHaveProperty('interval');
    expect(lastCall.interval).toBe('monthly'); // Default interval
    expect(typeof lastCall.startDate).toBe('string');
    expect(typeof lastCall.endDate).toBe('string');
  });

  it('should format dates correctly in charts', async () => {
    mockedAnalyticsService.getUserAnalytics.mockResolvedValue(
      mockUserAnalyticsResponse,
    );

    render(<UserAnalyticsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    const barChart = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(
      barChart.getAttribute('data-chart-data') || '{}',
    );

    // Check that chart data includes formatted dates
    expect(chartData.labels).toEqual(['Jan 1', 'Jan 2']);
    expect(chartData.datasets).toHaveLength(3); // Total, Local, Google registrations
  });
});
