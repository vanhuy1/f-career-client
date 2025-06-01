import { ROLES } from '@/enums/roles.enum';

export interface User {
  name: string;
  username: string;
  roles: ROLES;
  email: string;
  isAccountDisabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserProfile {
  data: {
    id: string;
    name: string;
    username: string;
    email: string;
    roles: ROLES;
    isAccountDisabled: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    companyId: string;
    phone: string;
    gender: string;
    dob: string;
    avatar: string;
  };
  meta: {
    message: string;
    statusCode: number;
  };
}
