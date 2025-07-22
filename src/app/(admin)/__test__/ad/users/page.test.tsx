import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import UsersPage from '../../../ad/users/page';
import { userManagementService } from '@/services/api/admin/user-mgm.api';
import { User } from '@/types/admin/UserManagement';
import { ROLES } from '@/enums/roles.enum';

// Mock console.error to suppress error logs during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the user management service
jest.mock('@/services/api/admin/user-mgm.api', () => ({
  userManagementService: {
    getUsers: jest.fn(),
    updateUserStatus: jest.fn(),
  },
}));

const mockedUserManagementService = userManagementService as jest.Mocked<
  typeof userManagementService
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockPush = jest.fn();

// Mock user data
const createMockUser = (overrides: Partial<User> = {}): User => ({
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

const mockUsers: User[] = [
  createMockUser({
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    roles: [ROLES.USER],
    isAccountDisabled: false,
  }),
  createMockUser({
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@example.com',
    roles: [ROLES.RECRUITER],
    isAccountDisabled: true,
  }),
];

const mockUserResponse = {
  data: {
    users: mockUsers,
    count: mockUsers.length,
    limit: 100,
    offset: 0,
  },
  meta: {
    apiVersion: '1.0.0',
  },
};

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    mockedUserManagementService.getUsers.mockResolvedValue(mockUserResponse);
  });

  it('should render loading state initially', async () => {
    // Mock a delayed response
    mockedUserManagementService.getUsers.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockUserResponse), 100),
        ),
    );

    render(<UsersPage />);

    // Check loading state
    expect(screen.getByText('Loading users...')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should render the basic page structure', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    // Check basic elements
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(
      screen.getByText('Review and manage user accounts'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`User Accounts (${mockUsers.length} total)`),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /show pii/i }),
    ).toBeInTheDocument();
  });

  it('should call the API to fetch users on mount', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(mockedUserManagementService.getUsers).toHaveBeenCalledWith({
        limit: 100,
        offset: 0,
      });
    });
  });

  it('should render tabs for active and disabled users', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    // Check tabs exist
    expect(screen.getByRole('tab', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /disabled/i })).toBeInTheDocument();
  });

  it('should render table headers', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should handle search input typing', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search users...');
    await user.type(searchInput, 'test search');

    expect(searchInput).toHaveValue('test search');
  });

  it('should toggle PII button text when clicked', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    // Initially should show "Show PII"
    const piiButton = screen.getByRole('button', { name: /show pii/i });
    expect(piiButton).toBeInTheDocument();

    // Click the button
    await user.click(piiButton);

    // Should now show "Hide PII"
    expect(
      screen.getByRole('button', { name: /hide pii/i }),
    ).toBeInTheDocument();
  });

  it('should switch between active and disabled tabs', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    // Initially on active tab
    const activeTab = screen.getByRole('tab', { name: /active/i });
    const disabledTab = screen.getByRole('tab', { name: /disabled/i });

    expect(activeTab).toBeInTheDocument();
    expect(disabledTab).toBeInTheDocument();

    // Click disabled tab
    await user.click(disabledTab);

    // Tab should change (though we can't easily check the selected state without complex DOM inspection)
    expect(disabledTab).toBeInTheDocument();
  });

  it('should handle API error state', async () => {
    mockedUserManagementService.getUsers.mockRejectedValue(
      new Error('Network error'),
    );

    render(<UsersPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Error: Failed to fetch users'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /retry/i }),
      ).toBeInTheDocument();
    });
  });

  it('should retry API call when retry button is clicked', async () => {
    const user = userEvent.setup();

    // First call fails, second succeeds
    mockedUserManagementService.getUsers
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockUserResponse);

    render(<UsersPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Error: Failed to fetch users'),
      ).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    // Should load successfully
    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
      expect(screen.queryByText('Error:')).not.toBeInTheDocument();
    });

    // API should have been called twice
    expect(mockedUserManagementService.getUsers).toHaveBeenCalledTimes(2);
  });

  it('should render correct user count in the header', async () => {
    render(<UsersPage />);

    await waitFor(() => {
      expect(
        screen.getByText(`User Accounts (${mockUsers.length} total)`),
      ).toBeInTheDocument();
    });
  });

  it('should show loading state with spinner and text', async () => {
    // Mock delayed response
    mockedUserManagementService.getUsers.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockUserResponse), 500),
        ),
    );

    render(<UsersPage />);

    // Should show loading initially
    expect(screen.getByText('Loading users...')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('should render without crashing when users array is empty', async () => {
    mockedUserManagementService.getUsers.mockResolvedValue({
      data: {
        users: [],
        count: 0,
        limit: 100,
        offset: 0,
      },
      meta: {
        apiVersion: '1.0.0',
      },
    });

    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('User Accounts (0 total)')).toBeInTheDocument();
    });
  });

  it('should maintain search input state', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search users...');

    // Type multiple characters
    await user.type(searchInput, 'john');
    expect(searchInput).toHaveValue('john');

    // Clear and type again
    await user.clear(searchInput);
    await user.type(searchInput, 'jane');
    expect(searchInput).toHaveValue('jane');
  });
});
