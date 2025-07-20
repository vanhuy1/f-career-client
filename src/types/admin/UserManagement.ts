import { ROLES } from '@/enums/roles.enum';

// Get Users

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  roles: ROLES[];
  isAccountDisabled: boolean;
  gender: string | null;
  phone: string | null;
  avatar: string | null;
  dob: string | null;
  createdAt: string;
  updatedAt: string;
  companyId: string | null;
}

export interface UserManagementData {
  users: User[];
  count: number;
  limit: number;
  offset: number;
}

export interface ApiMeta {
  apiVersion: string;
}

export interface UserResponse {
  data: UserManagementData;
  meta: ApiMeta;
}

export interface UserManagementRequest {
  limit: number;
  offset: number;
}

// Get User Detail
export interface UserDetailResponse {
  data: User;
  meta: ApiMeta;
}

export interface UserDetailRequest {
  id: string;
}

// Update Role of User

// Update User Status
export interface UserStatusRequest {
  id: string;
  isAccountDisabled: boolean;
}
