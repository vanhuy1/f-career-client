import { z } from 'zod';

const companyDetailsSchemaInput = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z
    .string()
    .min(1, 'Website is required')
    .transform((url) =>
      url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`,
    )
    .refine(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'Invalid URL',
      },
    ),
  founded: z
    .string()
    .min(1, 'Founded date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date',
    }),
  employees: z.string().min(1, 'Employee count is required'),
  location: z.string().min(1, 'Location is required'),
  industry: z.string().min(1, 'Industry is required'),
});

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  image: z.string().url('Image must be a valid URL'),
});

export const companyDetailsSchema = companyDetailsSchemaInput
  .transform((data) => ({
    ...data,
    founded: new Date(data.founded),
  }))
  .refine((data) => data.founded <= new Date('2025-04-26'), {
    message: 'Founded date cannot be in the future',
    path: ['founded'],
  });

export const teamMembersSchema = z.array(teamMemberSchema);

// Export TypeScript types for input and output
export type CompanyDetailsInput = z.infer<typeof companyDetailsSchemaInput>;
export type CompanyDetails = z.infer<typeof companyDetailsSchema>;

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type TeamMembersInput = z.infer<typeof teamMembersSchema>;

// Export the input schema for use in the form
export { companyDetailsSchemaInput, teamMemberSchema };
