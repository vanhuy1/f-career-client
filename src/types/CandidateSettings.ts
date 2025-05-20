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

// Data Types for Profile

// Base Profile Data Type
export interface ProfileData {
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  accountType: 'jobSeeker' | 'employer';
}

// Request DTO for Profile Update
export type ProfileUpdateRequest = ProfileData;
// Type alias used for semantic clarity in request handling
// Can be converted to an interface if request-specific fields are needed

// Response DTO for Profile Update
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
