'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  Video,
  MapPin,
  Users,
  Calendar,
  Building,
  FileText,
} from 'lucide-react';

// Type for interview schedule data from Application types
export interface InterviewScheduleData {
  companyName?: string;
  createdBy: number;
  title: string;
  type: string;
  status: string;
  startsAt: string;
  endsAt: string;
  location: string;
  notes: string | null;
  version?: number;
  createdAt: string;
  updatedAt: string;
}

interface InterviewScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleData: InterviewScheduleData | null;
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'interview':
      return <Users className="h-5 w-5" />;
    case 'meeting':
      return <Video className="h-5 w-5" />;
    default:
      return <Calendar className="h-5 w-5" />;
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function InterviewScheduleDialog({
  isOpen,
  onOpenChange,
  scheduleData,
}: InterviewScheduleDialogProps) {
  if (!scheduleData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(scheduleData.type)}</span>
            <span>Interview Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Type and Status */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {scheduleData.type}
            </Badge>
            <Badge className={getStatusBadgeColor(scheduleData.status)}>
              {scheduleData.status.charAt(0).toUpperCase() +
                scheduleData.status.slice(1)}
            </Badge>
          </div>

          {/* Event Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {scheduleData.title}
            </h3>
          </div>

          {/* Company Information */}
          {scheduleData.companyName && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="h-4 w-4" />
              <span>{scheduleData.companyName}</span>
            </div>
          )}

          {/* Event Date */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDateTime(scheduleData.startsAt)}</span>
          </div>

          {/* Event Time Range */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(scheduleData.startsAt)} -{' '}
              {formatTime(scheduleData.endsAt)}
            </span>
          </div>

          {/* Location */}
          {scheduleData.location && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4" />
              <span className="break-all">{scheduleData.location}</span>
            </div>
          )}

          {/* Notes */}
          {scheduleData.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Notes</span>
              </div>
              <div className="rounded-md bg-gray-50 p-3 pl-6 text-sm text-gray-600">
                {scheduleData.notes}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="border-t pt-2">
            <div className="space-y-1 text-xs text-gray-500">
              <div>
                Created: {new Date(scheduleData.createdAt).toLocaleDateString()}
              </div>
              <div>
                Last updated:{' '}
                {new Date(scheduleData.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
