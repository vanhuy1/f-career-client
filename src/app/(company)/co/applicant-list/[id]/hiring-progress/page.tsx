'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Calendar } from 'lucide-react';
import { ApplicationStatus } from '@/enums/applicationStatus';
import {
  clearApplicantDetail,
  useApplicantDetail,
} from '@/services/state/applicantDetailSlice';
import { applicationService } from '@/services/api/applications/application-api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/store/hooks';
import ScheduleEventModal from '@/app/(company)/_components/ScheduleEventModal';
import { useUser } from '@/services/state/userSlice';

const stageMapping = {
  [ApplicationStatus.APPLIED]: 'APPLIED',
  [ApplicationStatus.IN_REVIEW]: 'IN_REVIEW',
  [ApplicationStatus.SHORTED_LIST]: 'SHORTED_LIST',
  [ApplicationStatus.INTERVIEW]: 'INTERVIEW',
  [ApplicationStatus.HIRED]: 'HIRED',
  [ApplicationStatus.REJECTED]: 'REJECTED',
};

export default function HiringManagementPage() {
  const applicant = useApplicantDetail();
  const dispatch = useAppDispatch();
  const user = useUser();

  const stages = [
    { key: ApplicationStatus.APPLIED, label: 'APPLIED' },
    { key: ApplicationStatus.IN_REVIEW, label: 'IN_REVIEW' },
    { key: ApplicationStatus.SHORTED_LIST, label: 'SHORTED_LIST' },
    { key: ApplicationStatus.INTERVIEW, label: 'INTERVIEW' },
    { key: ApplicationStatus.HIRED, label: 'HIRED' },
    { key: ApplicationStatus.REJECTED, label: 'REJECTED' },
  ];

  const getCurrentStageIndex = () => {
    switch (applicant?.status) {
      case ApplicationStatus.APPLIED:
        return 0;
      case ApplicationStatus.IN_REVIEW:
        return 1;
      case ApplicationStatus.SHORTED_LIST:
        return 2;
      case ApplicationStatus.INTERVIEW:
        return 3;
      case ApplicationStatus.HIRED:
        return 4;
      case ApplicationStatus.REJECTED:
        return 5;
      default:
        return 0;
    }
  };

  // const getStageColor = (index: number) => {
  //   const currentIndex = getCurrentStageIndex();
  //   if (index <= currentIndex) {
  //     if (applicant?.status === ApplicationStatus.REJECTED) {
  //       return 'bg-red-500 text-white';
  //     } else if (applicant?.status === ApplicationStatus.HIRED) {
  //       return 'bg-green-500 text-white';
  //     } else {
  //       return index === currentIndex
  //         ? 'bg-blue-500 text-white'
  //         : 'bg-blue-100 text-blue-600';
  //     }
  //   }
  //   return 'bg-gray-100 text-gray-500';
  // };

  const getStageStyle = (index: number) => {
    const currentIndex = getCurrentStageIndex();
    const isCurrent = index === currentIndex;
    const isCompleted = index < currentIndex;
    // const isFuture = index > currentIndex;

    if (
      applicant?.status === ApplicationStatus.REJECTED &&
      index === currentIndex
    ) {
      return {
        backgroundColor: '#EF4444',
        color: '#FFFFFF',
        clipPath:
          index === 0
            ? 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)'
            : index === stages.length - 1
              ? 'polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%)'
              : 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
      };
    } else if (
      applicant?.status === ApplicationStatus.HIRED &&
      index === currentIndex
    ) {
      return {
        backgroundColor: '#10B981',
        color: '#FFFFFF',
        clipPath:
          index === 0
            ? 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)'
            : index === stages.length - 1
              ? 'polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%)'
              : 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
      };
    } else if (isCurrent) {
      return {
        backgroundColor: '#509EE3',
        color: '#FFFFFF',
        clipPath:
          index === 0
            ? 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)'
            : index === stages.length - 1
              ? 'polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%)'
              : 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
      };
    } else if (isCompleted) {
      return {
        backgroundColor: '#EBEBF5',
        color: '#4A90E2',
        clipPath:
          index === 0
            ? 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)'
            : index === stages.length - 1
              ? 'polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%)'
              : 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
      };
    } else {
      return {
        backgroundColor: '#FFFFFF',
        color: '#888888',
        clipPath:
          index === 0
            ? 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)'
            : index === stages.length - 1
              ? 'polygon(5% 0, 100% 0, 100% 100%, 5% 100%, 0 50%)'
              : 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)',
      };
    }
  };

  const handleEventCreated = () => {
    console.log('Event created successfully!');
    toast.success('Interview scheduled successfully!');
  };

  const isScheduleButtonEnabled = () => {
    return (
      applicant?.status === ApplicationStatus.INTERVIEW ||
      applicant?.status === ApplicationStatus.HIRED
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Current Stage:{' '}
          {applicant?.status ? stageMapping[applicant.status] : 'Unknown'}
        </h1>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-8 flex items-center justify-between">
            {stages.map((stage, index) => (
              <div key={index} className="flex flex-1">
                <div
                  className="flex h-12 w-full items-center justify-center text-sm font-medium"
                  style={getStageStyle(index)}
                >
                  {stage.label}
                </div>
              </div>
            ))}
          </div>

          {/* Stage Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Stage Info</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Interview Date
                </h3>
                <p className="text-lg font-medium text-gray-900">
                  10 - 13 July 2021
                </p>
              </div> */}

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Interview Status
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-600 hover:bg-orange-100"
                >
                  {applicant?.status
                    ? stageMapping[applicant.status]
                    : 'Unknown'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Interview Location
                </h3>
                <div className="text-gray-900">
                  <p className="font-medium">
                    Silver Crysta Room, Nomad Office
                  </p>
                  <p>3517 W. Gray St. Utica,</p>
                  <p>Pennsylvania 57867</p>
                </div>
              </div> */}

              {/* <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Assigned to
                </h3>
                <div className="flex -space-x-2">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </div>
              </div> */}
            </div>

            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
                    disabled={
                      applicant?.status === ApplicationStatus.HIRED ||
                      applicant?.status === ApplicationStatus.REJECTED
                    }
                  >
                    Move To Next Step
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {stages.map((stage) => (
                    <DropdownMenuItem
                      key={stage.key}
                      onClick={async () => {
                        try {
                          if (applicant?.id) {
                            // Call API to update the status
                            await applicationService.updateHiringProgress({
                              applicantId: applicant.id.toString(),
                              status: stage.key,
                            });
                            // You may want to add a toast notification or refresh data here
                            console.log(
                              `Successfully updated status to: ${stage.label}`,
                            );
                            toast.success(`Status updated to ${stage.label}`);
                            dispatch(clearApplicantDetail());
                          }
                        } catch (error) {
                          console.error('Failed to update status:', error);
                          toast.error(error as string);
                        }
                      }}
                      disabled={stage.key === applicant?.status}
                    >
                      {stage.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {isScheduleButtonEnabled() && (
                <ScheduleEventModal
                  companyId={user?.data?.companyId as number}
                  candidateUserId={applicant?.candidate?.id}
                  applicationId={applicant?.id as number}
                  onEventCreated={handleEventCreated}
                  triggerButton={
                    <Button
                      variant="outline"
                      className="border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Interview
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Notes
            </CardTitle>
            <Button
              variant="outline"
              className="border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => setShowAddNote(!showAddNote)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Notes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showAddNote && (
            <div className="space-y-3">
              <Textarea
                placeholder="Add your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddNote} size="sm">
                  Add Note
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddNote(false);
                    setNewNote('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={note.avatar || '/placeholder.svg'} />
                  <AvatarFallback>
                    {note.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{note.author}</h4>
                    <span className="text-sm text-gray-500">
                      {note.timestamp}
                    </span>
                  </div>
                  <p className="mb-2 text-gray-700">{note.content}</p>
                  {note.replies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-blue-600 hover:text-blue-700"
                    >
                      <MessageCircle className="mr-1 h-4 w-4" />
                      {note.replies} Replies
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
