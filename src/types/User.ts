import { Roles } from '@/enums/roles.enum';

export interface User {
  id: string; // Using string to align with common TypeScript conventions for IDs (can be number if preferred)
  email: string;
  password: string;
  role: Roles;
  firstName?: string; // Optional first name
  lastName?: string; // Optional last name
  isVerified: boolean;
  createdAt: string; // Using string for datetime (can use Date if preferred)
  updatedAt: string; // Using string for datetime (can use Date if preferred)
}
