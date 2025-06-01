// Data types for user profile
export interface UserProfile {
  email: string;
  isEmailVerified: boolean;
}

// Request DTOs
export interface UpdateEmailRequestDto {
  newEmail: string;
}

export interface ChangePasswordRequestDto {
  oldPassword: string;
  newPassword: string;
}

// Response DTOs
export interface UpdateEmailResponseDto {
  email: string;
  isEmailVerified: boolean;
  message: string;
  success: boolean;
}

export interface ChangePasswordResponseDto {
  message: string;
  success: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Base Profile Data Type
export interface ProfileData {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
}

// Request DTO for Profile Update
export type ProfileUpdateRequest = ProfileData;
export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: ProfileData;
  updatedAt: string;
}

// Error Response
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
