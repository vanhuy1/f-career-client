import { z } from 'zod';
import { EventType, ParticipantRole } from '@/types/Schedule';

export const scheduleEventFormSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: 'Title is required' })
      .min(3, { message: 'Title must be at least 3 characters' })
      .max(100, { message: 'Title must be less than 100 characters' }),

    type: z.nativeEnum(EventType, {
      errorMap: () => ({ message: 'Please select a valid event type' }),
    }),

    startsAt: z
      .string()
      .min(1, { message: 'Start date and time is required' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Start date must be a valid date',
      })
      .refine((val) => new Date(val) > new Date(), {
        message: 'Start date must be in the future',
      }),

    endsAt: z
      .string()
      .min(1, { message: 'End date and time is required' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'End date must be a valid date',
      }),

    location: z
      .string()
      .min(1, { message: 'Location is required' })
      .max(200, { message: 'Location must be less than 200 characters' }),

    notes: z
      .string()
      .max(500, { message: 'Notes must be less than 500 characters' })
      .optional(),

    applicationId: z
      .number({
        invalid_type_error: 'Invalid application ID',
      })
      .min(1, { message: 'Valid application ID is required' })
      .optional(),

    participantUserId: z
      .number({
        required_error: 'Participant is required',
        invalid_type_error: 'Please select a valid participant',
      })
      .min(1, { message: 'Please select a participant' }),

    participantRole: z.nativeEnum(ParticipantRole, {
      errorMap: () => ({ message: 'Please select a valid participant role' }),
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.startsAt);
      const end = new Date(data.endsAt);
      return end > start;
    },
    {
      message: 'End time must be after start time',
      path: ['endsAt'],
    },
  )
  .refine(
    (data) => {
      const start = new Date(data.startsAt);
      const end = new Date(data.endsAt);
      const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return diffInHours <= 8; // Maximum 8 hours duration
    },
    {
      message: 'Event duration cannot exceed 8 hours',
      path: ['endsAt'],
    },
  )
  .refine(
    (data) => {
      // For INTERVIEW events, applicationId is required
      if (data.type === EventType.INTERVIEW && !data.applicationId) {
        return false;
      }
      return true;
    },
    {
      message: 'Application ID is required for interview events',
      path: ['applicationId'],
    },
  );

export type ScheduleEventFormData = z.infer<typeof scheduleEventFormSchema>;
