'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MapPin, Plus, Loader2 } from 'lucide-react';
import ScheduleEventModal from '@/app/(company)/_components/ScheduleEventModal';
import { useUser } from '@/services/state/userSlice';
import { useApplicantDetail } from '@/services/state/applicantDetailSlice';
import { companyService } from '@/services/api/company/company-api';
import {
  ScheduleEventResponse,
  EventType,
  EventStatus,
  ScheduleEventsListResponse,
} from '@/types/Schedule';
import { useState, useEffect, useCallback } from 'react';

interface LoadingState {
  loading: boolean;
  error: string | null;
}

export default function InterviewSchedulePage() {
  const user = useUser();
  const applicant = useApplicantDetail();
  const [events, setEvents] = useState<ScheduleEventResponse[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    loading: true,
    error: null,
  });

  const fetchEvents = useCallback(async () => {
    if (!user?.data?.companyId) return;

    try {
      setLoadingState({ loading: true, error: null });

      const response: ScheduleEventsListResponse =
        await companyService.getEvents(Number(user.data.companyId), {
          type: EventType.INTERVIEW,
          // We can add more filters here if needed
        });

      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setLoadingState({
        loading: false,
        error: 'Failed to load interview schedules. Please try again.',
      });
      return;
    }

    setLoadingState({ loading: false, error: null });
  }, [user?.data?.companyId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventCreated = () => {
    console.log('Event created successfully!');
    fetchEvents(); // Refresh the events list
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const formatTimeString = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    return `${formatTimeString(start)} - ${formatTimeString(end)}`;
  };

  const getStatusDisplay = (status: EventStatus) => {
    switch (status) {
      case EventStatus.CONFIRMED:
        return {
          label: 'Scheduled',
          className: 'bg-green-100 text-green-700',
        };
      case EventStatus.PENDING:
        return {
          label: 'Pending Confirmation',
          className: 'bg-yellow-100 text-yellow-700',
        };
      case EventStatus.CANCELLED:
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-700',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-700',
        };
    }
  };

  const getInterviewer = (event: ScheduleEventResponse) => {
    const interviewer = event.participants.find(
      (p) => p.role === 'interviewer' && p.user?.name,
    );
    return interviewer?.user?.name || 'TBD';
  };

  if (loadingState.loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
        <span className="ml-2 text-gray-600">
          Loading interview schedules...
        </span>
      </div>
    );
  }

  if (loadingState.error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-red-700">{loadingState.error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={fetchEvents}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Interview Schedule
        </h3>
        <ScheduleEventModal
          companyId={user?.data?.companyId as number}
          candidateUserId={applicant?.candidate?.id}
          applicationId={applicant?.id as number}
          onEventCreated={handleEventCreated}
        />
      </div>

      <div className="space-y-4">
        {events.map((event) => {
          const statusDisplay = getStatusDisplay(event.status);
          const interviewer = getInterviewer(event);

          return (
            <div
              key={event.id}
              className="rounded-lg border border-gray-200 p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h4 className="mb-1 font-medium text-gray-900">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600">{interviewer}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusDisplay.className}`}
                  >
                    {statusDisplay.label}
                  </span>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formatDate(event.startsAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formatTime(event.startsAt, event.endsAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {event.location?.toLowerCase().includes('video') ||
                  event.location?.toLowerCase().includes('call') ||
                  event.location?.toLowerCase().includes('zoom') ||
                  event.location?.toLowerCase().includes('meet') ? (
                    <Video className="h-4 w-4 text-gray-400" />
                  ) : (
                    <MapPin className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {event.location || 'Location TBD'}
                  </span>
                </div>
              </div>

              {event.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{event.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                {(event.location?.toLowerCase().includes('video') ||
                  event.location?.toLowerCase().includes('call') ||
                  event.location?.toLowerCase().includes('zoom') ||
                  event.location?.toLowerCase().includes('meet')) && (
                  <Button variant="outline" size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Join Call
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <h4 className="mb-2 font-medium text-gray-900">
            No interviews scheduled
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Schedule interviews to continue the hiring process.
          </p>
          <ScheduleEventModal
            companyId={user?.data?.companyId as number}
            candidateUserId={applicant?.candidate?.id}
            applicationId={applicant?.id as number}
            onEventCreated={handleEventCreated}
            triggerButton={
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Interview
              </Button>
            }
          />
        </div>
      )}

      {events.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <h4 className="mb-2 font-medium text-gray-900">
            Schedule additional interviews
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Add more interview rounds for this candidate.
          </p>
          <ScheduleEventModal
            companyId={user?.data?.companyId as number}
            candidateUserId={applicant?.candidate?.id}
            applicationId={applicant?.id as number}
            onEventCreated={handleEventCreated}
            triggerButton={
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Interview
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
