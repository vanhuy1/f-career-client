'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  scheduleEventFormSchema,
  ScheduleEventFormData,
} from '@/schemas/Schedule';
import { companyService } from '@/services/api/company/company-api';
import {
  EventType,
  ParticipantRole,
  CreateScheduleEventRequest,
} from '@/types/Schedule';

interface ScheduleEventModalProps {
  companyId: number;
  candidateUserId?: number;
  applicationId?: number;
  onEventCreated?: () => void;
  triggerButton?: React.ReactNode;
}

export default function ScheduleEventModal({
  companyId,
  candidateUserId,
  applicationId,
  onEventCreated,
  triggerButton,
}: ScheduleEventModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScheduleEventFormData>({
    resolver: zodResolver(scheduleEventFormSchema),
    defaultValues: {
      title: '',
      type: EventType.INTERVIEW,
      startsAt: '',
      endsAt: '',
      location: '',
      notes: '',
      applicationId,
      participantUserId: candidateUserId,
      participantRole: ParticipantRole.CANDIDATE,
    },
  });

  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const onSubmit = async (data: ScheduleEventFormData) => {
    try {
      setIsSubmitting(true);

      // Convert datetime-local strings to ISO format
      const startsAt = new Date(data.startsAt).toISOString();
      const endsAt = new Date(data.endsAt).toISOString();

      const requestData: CreateScheduleEventRequest = {
        title: data.title,
        type: data.type,
        startsAt,
        endsAt,
        location: data.location,
        notes: data.notes || undefined,
        ...(data.applicationId && { applicationId: data.applicationId }),
        participants: [
          {
            userId: data.participantUserId,
            role: data.participantRole,
          },
        ],
      };

      await companyService.createEvent(companyId, requestData);

      toast.success('Event scheduled successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      form.reset();
      setOpen(false);
      onEventCreated?.();
    } catch (error: unknown) {
      console.error('Error creating event:', error);

      let errorMessage = 'Failed to create event. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700">
      <Plus className="mr-2 h-4 w-4" />
      Schedule Interview
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerButton || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule New Event
          </DialogTitle>
          <DialogDescription>
            Create a new interview or meeting. All participants will receive
            email notifications.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Technical Interview - Frontend Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EventType.INTERVIEW}>
                          Interview
                        </SelectItem>
                        <SelectItem value={EventType.MEETING}>
                          Meeting
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Participant Role */}
              <FormField
                control={form.control}
                name="participantRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participant Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ParticipantRole.CANDIDATE}>
                          Candidate
                        </SelectItem>
                        <SelectItem value={ParticipantRole.INTERVIEWER}>
                          Interviewer
                        </SelectItem>
                        <SelectItem value={ParticipantRole.ATTENDEE}>
                          Attendee
                        </SelectItem>
                        <SelectItem value={ParticipantRole.HOST}>
                          Host
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time */}
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        min={formatDateTimeLocal(new Date())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      End Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        min={
                          form.watch('startsAt') ||
                          formatDateTimeLocal(new Date())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Participant User ID (simplified for now) */}
              <FormField
                control={form.control}
                name="participantUserId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    {/* <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Participant User ID
                    </FormLabel> */}
                    <FormControl>
                      <Input
                        type="number"
                        hidden={true}
                        placeholder="Enter user ID (e.g., 6)"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    {/* <FormDescription>
                      Enter the user ID of the participant. In a full
                      implementation, this would be a searchable dropdown.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Application ID (hidden field) */}
              {applicationId && (
                <FormField
                  control={form.control}
                  name="applicationId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormControl>
                        <Input
                          type="number"
                          hidden={true}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseInt(e.target.value) || undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Conference Room A / Google Meet"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please prepare your portfolio and bring identification."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional instructions or information for participants
                      (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Create Event
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
