import { z } from 'zod';

export const updateEmailSchema = z.object({
  newEmail: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const ProfileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name must be less than 100 characters' }),

  phoneNumber: z
    .string()
    .min(6, { message: 'Phone number must be at least 6 characters' })
    .regex(/^[+]?[\d\s()-]+$/, {
      message: 'Please enter a valid phone number',
    }),

  email: z.string().email({ message: 'Please enter a valid email address' }),

  dateOfBirth: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: 'Date must be in DD/MM/YYYY format',
    }),

  gender: z.string().min(1, { message: 'Please select a gender' }),

  accountType: z.enum(['jobSeeker', 'employer'], {
    message: 'Please select a valid account type',
  }),
});

export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
