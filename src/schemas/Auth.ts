import { z } from 'zod';

export const signInRequestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().min(1),
  username: z.string().min(1),
});

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignInRequest = z.infer<typeof signInRequestSchema>;
