import { ROLES } from '@/enums/roles.enum';
import { z } from 'zod';

export const signInRequestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signUpRequestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscores',
    ),
  roles: z
    .array(z.enum(Object.values(ROLES) as [string, ...string[]]))
    .min(1, 'At least one role is required'),
});

export const companyInfoSchema = z.object({
  company_name: z.string().min(2, { message: 'Company name is required' }),
  company_website: z.string().optional(),
  taxCode: z.string().min(1, { message: 'Tax code is required' }),
  company_email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
});

// Schema kết hợp cho đăng ký company
export const companyRegistrationSchema = signUpRequestSchema.extend({
  companyName: z.string().min(2, { message: 'Company name is required' }),
  companyWebsite: z.string().optional(),
  taxCode: z.string().min(1, { message: 'Tax code is required' }),
  business_license_url: z.string().optional(),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const resetPasswordRequestSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Types
export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;
export type CompanyRegistrationRequest = z.infer<
  typeof companyRegistrationSchema
>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
