import { z } from 'zod';

export const updateEmailSchema = z.object({
  newEmail: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
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

export const ProfileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(100, { message: 'Full name must be less than 100 characters' }),

  phone: z
    .string()
    .min(9, { message: 'Phone number must be at least 9 digits' })
    .max(15, { message: 'Phone number must be less than 15 digits' })
    .regex(/^\d+$/, {
      message: 'Phone number must contain only digits',
    }),

  email: z.string().email({ message: 'Please enter a valid email address' }),

  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date of birth must be a valid date',
  }),

  gender: z.string().min(1, { message: 'Please select a gender' }),

  avatar: z.string().nullable().optional(),
});

export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
