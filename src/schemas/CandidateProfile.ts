import { z } from 'zod';

export const experienceSchema = z.object({
  role: z.string().min(2, { message: 'Role is required' }),
  company: z.string().min(2, { message: 'Company is required' }),
  logo: z.string().optional(),
  employmentType: z.string().min(1, { message: 'Employment type is required' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date().optional().nullable(),
  currentlyWorking: z.boolean(),
  location: z.string().min(2, { message: 'Location is required' }),
  description: z
    .string()
    .min(10, { message: 'Description should be at least 10 characters' }),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
