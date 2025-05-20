import type {
  ApiResponse,
  UpdateEmailRequestDto,
  UpdateEmailResponseDto,
  ChangePasswordRequestDto,
  ChangePasswordResponseDto,
} from '@/types/CandidateSettings';

// Simulating API calls with a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userApi = {
  updateEmail: async (
    data: UpdateEmailRequestDto,
  ): Promise<ApiResponse<UpdateEmailResponseDto>> => {
    try {
      // Simulate API call delay
      await delay(1000);

      // Simulate API response
      return {
        success: true,
        data: {
          email: data.newEmail,
          isEmailVerified: false,
          message:
            'Email updated successfully. Please verify your new email address.',
          success: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error as string,
      };
    }
  },

  changePassword: async (
    data: ChangePasswordRequestDto,
  ): Promise<ApiResponse<ChangePasswordResponseDto>> => {
    try {
      // Simulate API call delay
      await delay(1000);

      // In a real app, you would verify the old password here
      if (data.oldPassword === 'wrongpassword') {
        return {
          success: false,
          error: 'Current password is incorrect.',
        };
      }

      // Simulate API response
      return {
        success: true,
        data: {
          message: 'Password updated successfully.',
          success: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error as string,
      };
    }
  },
};
