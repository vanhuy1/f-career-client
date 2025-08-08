'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MapPin, Plus } from 'lucide-react';
import ScheduleEventModal from '@/app/(company)/_components/ScheduleEventModal';
import { useUser } from '@/services/state/userSlice';
import { useApplicantDetail } from '@/services/state/applicantDetailSlice';

export default function InterviewSchedulePage() {
  const user = useUser();
  const applicant = useApplicantDetail();

  // Get the interview schedules from applicant data
  const interviewSchedules = applicant?.interviewSchedules || [];

  const handleEventCreated = () => {
    console.log('Event created successfully!');
    // The layout will handle refetching applicant data which includes the updated schedule
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

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          label: 'Scheduled',
          className: 'bg-green-100 text-green-700',
        };
      case 'pending':
        return {
          label: 'Pending Confirmation',
          className: 'bg-yellow-100 text-yellow-700',
        };
      case 'cancelled':
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
        {interviewSchedules.map((schedule, index) => {
          const statusDisplay = getStatusDisplay(schedule.status);
          return (
            <div
              key={`${schedule.createdAt}-${index}`}
              className="rounded-lg border border-gray-200 p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h4 className="mb-1 font-medium text-gray-900">
                    {schedule.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {schedule.companyName}
                  </p>
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
                    {formatDate(schedule.startsAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formatTime(schedule.startsAt, schedule.endsAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {schedule.location?.toLowerCase().includes('video') ||
                  schedule.location?.toLowerCase().includes('call') ||
                  schedule.location?.toLowerCase().includes('zoom') ||
                  schedule.location?.toLowerCase().includes('meet') ? (
                    <Video className="h-4 w-4 text-gray-400" />
                  ) : (
                    <MapPin className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {schedule.location || 'Location TBD'}
                  </span>
                </div>
              </div>

              {schedule.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{schedule.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                {(schedule.location?.toLowerCase().includes('video') ||
                  schedule.location?.toLowerCase().includes('call') ||
                  schedule.location?.toLowerCase().includes('zoom') ||
                  schedule.location?.toLowerCase().includes('meet')) && (
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

      {interviewSchedules.length === 0 && (
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

      {interviewSchedules.length > 0 && (
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
