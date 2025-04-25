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
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignInRequest = z.infer<typeof signInRequestSchema>;

export const companyInfoSchema = z.object({
  company_name: z.string().min(2, { message: 'Company name is required' }),
  company_website: z.string().url({ message: 'Please enter a valid URL' }),
  tax_code: z.string().min(1, { message: 'Tax code is required' }),
  business_license_url: z.string().optional(),
  company_email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;
