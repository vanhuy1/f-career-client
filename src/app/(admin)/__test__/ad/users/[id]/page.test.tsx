import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';
import UserDetailPage from '../../../../ad/users/[id]/page';
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
  useParams: jest.fn(),
}));

// Mock the user management service
jest.mock('@/services/api/admin/user-mgm.api', () => ({
  userManagementService: {
    getUserDetail: jest.fn(),
    updateUserStatus: jest.fn(),
  },
}));

const mockedUserManagementService = userManagementService as jest.Mocked<
  typeof userManagementService
>;
const mockedUseRouter = useRouter as jest.Mock;
const mockedUseParams = useParams as jest.Mock;

// Mock user data
const mockUser: User = {
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
};

const mockDisabledUser: User = {
  ...mockUser,
  id: 2,
  isAccountDisabled: true,
};

describe('UserDetailPage', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });

    mockedUseParams.mockReturnValue({
      id: '1',
    });
  });

  it('should render loading state initially', async () => {
    // Mock a delayed response
    mockedUserManagementService.getUserDetail.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100)),
    );

    render(<UserDetailPage />);

    // Check loading state
    expect(screen.getByText('Loading user details...')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.getByText('User Details')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should display user information correctly', async () => {
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check personal information (some appear multiple times)
    expect(screen.getAllByText('John Doe')).toHaveLength(2); // Appears in profile and details
    expect(screen.getAllByText('@johndoe')).toHaveLength(2); // Username appears in profile and details
    expect(screen.getAllByText('john.doe@example.com')).toHaveLength(2); // Email appears in profile and details
    expect(screen.getAllByText('+1234567890')).toHaveLength(2); // Phone appears in profile and details
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getAllByText('company-123')).toHaveLength(2); // Company ID appears in profile and details

    // Check active status badge (appears twice)
    expect(screen.getAllByText('Active')).toHaveLength(2);

    // Check that disable button is present for active user
    expect(
      screen.getByRole('button', { name: /disable account/i }),
    ).toBeInTheDocument();
  });

  it('should display disabled user correctly', async () => {
    mockedUseParams.mockReturnValue({ id: '2' });
    mockedUserManagementService.getUserDetail.mockResolvedValue(
      mockDisabledUser,
    );

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check disabled status badge (appears twice)
    expect(screen.getAllByText('Disabled')).toHaveLength(2);

    // Check that enable button is present for disabled user
    expect(
      screen.getByRole('button', { name: /enable account/i }),
    ).toBeInTheDocument();
  });

  it('should handle error state correctly', async () => {
    const errorMessage = 'Failed to fetch user details';
    mockedUserManagementService.getUserDetail.mockRejectedValue(
      new Error(errorMessage),
    );

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch user details'),
      ).toBeInTheDocument();
    });

    // Check retry button is present
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should handle retry functionality', async () => {
    const user = userEvent.setup();

    // First call fails
    mockedUserManagementService.getUserDetail.mockRejectedValueOnce(
      new Error('Network error'),
    );
    // Second call succeeds
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch user details'),
      ).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')).toHaveLength(2); // Name appears in multiple places
    });

    expect(mockedUserManagementService.getUserDetail).toHaveBeenCalledTimes(2);
  });

  it('should handle back navigation', async () => {
    const user = userEvent.setup();
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back to users/i });
    await user.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/ad/users');
  });

  it('should handle user status change from active to disabled', async () => {
    const user = userEvent.setup();
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);
    mockedUserManagementService.updateUserStatus.mockResolvedValue({
      ...mockUser,
      isAccountDisabled: true,
    });

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    const disableButton = screen.getByRole('button', {
      name: /disable account/i,
    });
    await user.click(disableButton);

    await waitFor(() => {
      expect(mockedUserManagementService.updateUserStatus).toHaveBeenCalledWith(
        {
          id: '1',
          isAccountDisabled: true,
        },
      );
    });

    // Check that the UI updates to show disabled state
    await waitFor(() => {
      expect(screen.getAllByText('Disabled')).toHaveLength(2); // Badge appears twice on page
      expect(
        screen.getByRole('button', { name: /enable account/i }),
      ).toBeInTheDocument();
    });
  });

  it('should handle user status change from disabled to active', async () => {
    const user = userEvent.setup();
    mockedUseParams.mockReturnValue({ id: '2' });
    mockedUserManagementService.getUserDetail.mockResolvedValue(
      mockDisabledUser,
    );
    mockedUserManagementService.updateUserStatus.mockResolvedValue({
      ...mockDisabledUser,
      isAccountDisabled: false,
    });

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    const enableButton = screen.getByRole('button', {
      name: /enable account/i,
    });
    await user.click(enableButton);

    await waitFor(() => {
      expect(mockedUserManagementService.updateUserStatus).toHaveBeenCalledWith(
        {
          id: '2',
          isAccountDisabled: false,
        },
      );
    });

    // Check that the UI updates to show active state
    await waitFor(() => {
      expect(screen.getAllByText('Active')).toHaveLength(2); // Badge appears twice on page
      expect(
        screen.getByRole('button', { name: /disable account/i }),
      ).toBeInTheDocument();
    });
  });

  it('should handle status update error', async () => {
    const user = userEvent.setup();
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);
    mockedUserManagementService.updateUserStatus.mockRejectedValue(
      new Error('Update failed'),
    );

    // Mock console.error to prevent error output in tests
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    const disableButton = screen.getByRole('button', {
      name: /disable account/i,
    });
    await user.click(disableButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating user status:',
        expect.any(Error),
      );
    });

    // The error should trigger setError which would cause the page to show the error state
    await waitFor(() => {
      expect(
        screen.getByText('Failed to update user status'),
      ).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should display user roles correctly', async () => {
    const userWithMultipleRoles = {
      ...mockUser,
      roles: [ROLES.USER, ROLES.RECRUITER],
    };
    mockedUserManagementService.getUserDetail.mockResolvedValue(
      userWithMultipleRoles,
    );

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check roles are displayed
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('RECRUITER')).toBeInTheDocument();
  });

  it('should format dates correctly', async () => {
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check formatted dates (DOB appears in two places)
    expect(screen.getAllByText('May 15, 1990')).toHaveLength(2); // DOB
    // The exact format depends on the locale, so check for partial matches
    expect(screen.getByText(/January 15, 2023/)).toBeInTheDocument(); // Created date
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument(); // Updated date
  });

  it('should handle missing optional fields', async () => {
    const userWithMissingFields = {
      ...mockUser,
      phone: null,
      dob: null,
      gender: null,
      companyId: null,
      avatar: null,
    };
    mockedUserManagementService.getUserDetail.mockResolvedValue(
      userWithMissingFields,
    );

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check that "Not provided" or "Not specified" text is shown for missing fields
    expect(screen.getAllByText('Not provided')).toHaveLength(2); // Phone and DOB
    expect(screen.getByText('Not specified')).toBeInTheDocument(); // Gender
    expect(screen.getByText('Not associated')).toBeInTheDocument(); // Company
  });

  it('should display avatar fallback when no avatar provided', async () => {
    const userWithoutAvatar = {
      ...mockUser,
      avatar: null,
    };
    mockedUserManagementService.getUserDetail.mockResolvedValue(
      userWithoutAvatar,
    );

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check that avatar fallback with initials is displayed
    const avatarFallback = screen.getByText('JD'); // John Doe initials
    expect(avatarFallback).toBeInTheDocument();
  });

  it('should call getUserDetail with correct user ID', async () => {
    const testUserId = '123';
    mockedUseParams.mockReturnValue({ id: testUserId });
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(mockedUserManagementService.getUserDetail).toHaveBeenCalledWith(
        testUserId,
      );
    });
  });

  it('should handle user not found scenario', async () => {
    mockedUserManagementService.getUserDetail.mockResolvedValue(null as any);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should display all section headers correctly', async () => {
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check section headers
    expect(screen.getByText('Profile Overview')).toBeInTheDocument();
    expect(screen.getByText('Detailed Information')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Account Information')).toBeInTheDocument();
  });

  it('should validate all user information fields are displayed', async () => {
    mockedUserManagementService.getUserDetail.mockResolvedValue(mockUser);

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('User Details')).toBeInTheDocument();
    });

    // Check all field labels are present
    const fieldLabels = [
      'Full Name',
      'Username',
      'Email Address',
      'Gender',
      'Phone Number',
      'Date of Birth',
      'User ID',
      'Account Status',
      'Roles',
      'Company ID',
      'Member Since',
      'Last Updated',
    ];

    fieldLabels.forEach((label) => {
      // Some labels appear multiple times on the page, so use getAllByText
      const elements = screen.getAllByText(label);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
