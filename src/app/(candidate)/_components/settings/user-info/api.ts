import type {
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  ApiError,
} from '@/types/CandidateSettings';
import profileResponseData from '@/app/(candidate)/_components/settings/user-info/mocks/profile-response.json';

/**
 * Update user profile
 * @param data Profile data to update
 * @returns Promise with the updated profile data
 */
export async function updateProfile(
  data: ProfileUpdateRequest,
): Promise<ProfileUpdateResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate validation error (for demonstration)
  if (!data.email.includes('@')) {
    const error: ApiError = {
      statusCode: 400,
      message: 'Validation failed',
      errors: {
        email: ['Please provide a valid email address'],
      },
    };
    throw error;
  }

  // Simulate successful response
  // In a real app, you would make a fetch call to your API
  // return await fetch('/api/profile', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => {
  //   if (!res.ok) throw new Error('Failed to update profile');
  //   return res.json();
  // });

  // For this example, we'll return mock data
  const response: ProfileUpdateResponse = {
    ...profileResponseData,
    data: {
      ...profileResponseData.data,
      ...data,
    },
    updatedAt: new Date().toISOString(),
  };

  return response;
}
