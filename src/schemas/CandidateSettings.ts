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
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name must be less than 100 characters' }),

  phone: z
    .string()
    .min(6, { message: 'Phone number must be at least 6 characters' })
    .regex(/^[+]?\d[\d\s()-]+$/, {
      message: 'Please enter a valid phone number',
    }),

  email: z.string().email({ message: 'Please enter a valid email address' }),

  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date of birth must be a valid date',
  }),

  gender: z.string().min(1, { message: 'Please select a gender' }),

  avatar: z.string().optional(),
});

export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
