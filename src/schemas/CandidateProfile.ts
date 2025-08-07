import { z } from 'zod';

export const experienceSchema = z
  .object({
    role: z.string().min(2, { message: 'Role is required' }),
    company: z.string().min(2, { message: 'Company is required' }),
    logo: z.string().optional(),
    employmentType: z
      .string()
      .min(1, { message: 'Employment type is required' }),
    startDate: z.date({ required_error: 'Start date is required' }),
    endDate: z.date().optional().nullable(),
    currentlyWorking: z.boolean(),
    location: z.string().min(2, { message: 'Location is required' }),
    description: z
      .string()
      .min(10, { message: 'Description should be at least 10 characters' }),
  })
  .refine((data) => data.startDate <= new Date(), {
    message: 'Start date cannot be in the future',
    path: ['startDate'],
  })
  .refine((data) => !data.endDate || data.endDate <= new Date(), {
    message: 'End date cannot be in the future',
    path: ['endDate'],
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  });

export const educationSchema = z
  .object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    field: z.string().min(1, 'Field of study is required'),
    startYear: z.number().min(1900, 'Start year must be 1900 or later'),
    endYear: z.number().nullable(),
    currentlyStudying: z.boolean(),
    logo: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      const currentYear = new Date().getFullYear();
      return data.startYear <= currentYear;
    },
    {
      message: 'Start year cannot be in the future',
      path: ['startYear'],
    },
  )
  .refine(
    (data) => {
      if (data.endYear === null) return true; // Allow null endYear if currently studying
      const currentYear = new Date().getFullYear();
      return data.endYear <= currentYear;
    },
    {
      message: 'End year cannot be in the future',
      path: ['endYear'],
    },
  )
  .refine(
    (data) => {
      if (data.endYear === null) return true; // Skip duration check if no endYear
      return data.endYear - data.startYear >= 2;
    },
    {
      message: 'Duration between start and end year must be at least 2 years',
      path: ['endYear'],
    },
  );

export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
