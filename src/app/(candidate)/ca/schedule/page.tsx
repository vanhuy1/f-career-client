'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  Video,
  MapPin,
  Filter,
  X,
  Check,
  XCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { userService } from '@/services/api/auth/user-api';
import { eventService } from '@/services/api/schedule/schedule-api';
import {
  ScheduleEventResponse,
  EventType,
  EventStatus,
  CandidateScheduleResponse,
  GetCandidateScheduleRequest,
} from '@/types/Schedule';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

interface LoadingState {
  loading: boolean;
  error: string | null;
}

interface CalendarEvent extends ScheduleEventResponse {
  startDate: Date;
  endDate: Date;
  duration: number; // in minutes
  topPosition: number; // percentage from top of day
  height: number; // percentage height
}

interface DateFilter {
  startDate?: Date;
  endDate?: Date;
  type?: EventType;
  status?: EventStatus;
}

// Date utility functions moved outside component to avoid dependency issues
const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Start on Monday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfWeek = (date: Date) => {
  const end = new Date(getStartOfWeek(date));
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEventResponse[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    loading: true,
    error: null,
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateFilter, setDateFilter] = useState<DateFilter>({});
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingState({ loading: true, error: null });

      // Get events for the current week or date filter
      const startOfPeriod = dateFilter.startDate || getStartOfWeek(currentDate);
      const endOfPeriod = dateFilter.endDate || getEndOfWeek(currentDate);

      const query: GetCandidateScheduleRequest = {
        startDate: startOfPeriod.toISOString().split('T')[0],
        endDate: endOfPeriod.toISOString().split('T')[0],
        limit: 100, // Get more events for calendar view
        ...(dateFilter.type && { type: dateFilter.type }),
        ...(dateFilter.status && { status: dateFilter.status }),
      };

      const response: CandidateScheduleResponse =
        await userService.getScheduleInCandidateSite(query);

      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setLoadingState({
        loading: false,
        error: 'Failed to load schedule events. Please try again.',
      });
      return;
    }

    setLoadingState({ loading: false, error: null });
  }, [currentDate, dateFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    // Clear date filters when going to today
    setDateFilter((prev) => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
    }));
  };

  // Generate calendar days for the week
  const calendarDays = useMemo(() => {
    const start = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [currentDate]);

  // Process events for calendar display
  const calendarEvents = useMemo(() => {
    return events.map((event) => {
      const startDate = new Date(event.startsAt);
      const endDate = new Date(event.endsAt);
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // minutes

      // Calculate position in day (0-100%)
      const dayStart = new Date(startDate);
      dayStart.setHours(6, 0, 0, 0); // Calendar starts at 6 AM
      const dayEnd = new Date(startDate);
      dayEnd.setHours(22, 0, 0, 0); // Calendar ends at 10 PM

      const totalDayMinutes = 16 * 60; // 6 AM to 10 PM = 16 hours
      const eventStartMinutes =
        (startDate.getTime() - dayStart.getTime()) / (1000 * 60);

      const topPosition = Math.max(
        0,
        (eventStartMinutes / totalDayMinutes) * 100,
      );
      const height = Math.min(
        100 - topPosition,
        (duration / totalDayMinutes) * 100,
      );

      return {
        ...event,
        startDate,
        endDate,
        duration,
        topPosition,
        height,
      } as CalendarEvent;
    });
  }, [events]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return calendarEvents.filter(
      (event) => event.startDate >= dayStart && event.startDate <= dayEnd,
    );
  };

  // Time slots for the day view
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push({
        time: hour,
        label:
          hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
        value: `${hour}:00`,
      });
    }
    return slots;
  }, []);

  const formatWeekRange = () => {
    const start = getStartOfWeek(currentDate);
    const end = getEndOfWeek(currentDate);

    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
      })}`;
    } else {
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    // Priority: Status first, then type
    if (event.status === EventStatus.CANCELLED) {
      return 'bg-red-100 border-red-400 text-red-800';
    }

    // Different colors for event types
    if (event.type === EventType.INTERVIEW) {
      if (event.status === EventStatus.PENDING) {
        return 'bg-blue-50 border-blue-300 text-blue-700';
      } else if (event.status === EventStatus.CONFIRMED) {
        return 'bg-blue-100 border-blue-400 text-blue-800';
      }
    } else if (event.type === EventType.MEETING) {
      if (event.status === EventStatus.PENDING) {
        return 'bg-purple-50 border-purple-300 text-purple-700';
      } else if (event.status === EventStatus.CONFIRMED) {
        return 'bg-purple-100 border-purple-400 text-purple-800';
      }
    }

    // Fallback
    return 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getStatusBadgeColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case EventStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-300';
      case EventStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: EventType) => {
    switch (type) {
      case EventType.INTERVIEW:
        return '👤'; // Person icon for interviews
      case EventType.MEETING:
        return '📅'; // Calendar icon for meetings
      default:
        return '📋';
    }
  };

  const handleFilterChange = (
    key: keyof DateFilter,
    value: Date | EventType | EventStatus | string | undefined,
  ) => {
    setDateFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setDateFilter({});
    setShowFilterPopover(false);
  };

  const hasActiveFilters = () => {
    return !!(
      dateFilter.startDate ||
      dateFilter.endDate ||
      dateFilter.type ||
      dateFilter.status
    );
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleConfirmEvent = async () => {
    if (!selectedEvent) return;

    try {
      setIsActionLoading(true);
      await eventService.confirmEvent(selectedEvent.id);

      // Show success toast
      toast.success('Event confirmed successfully!', {
        className: 'bg-green-500 text-white font-semibold',
      });

      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to confirm event:', error);
      // Show error toast
      toast.error('Failed to confirm event. Please try again.', {
        className: 'bg-red-500 text-white font-semibold',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeclineEvent = async () => {
    if (!selectedEvent) return;

    try {
      setIsActionLoading(true);
      await eventService.declineEvent(selectedEvent.id);

      // Show success toast
      toast.success('Event declined successfully!', {
        className: 'bg-green-500 text-white font-semibold',
      });

      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to decline event:', error);
      // Show error toast
      toast.error('Failed to decline event. Please try again.', {
        className: 'bg-red-500 text-white font-semibold',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setIsActionLoading(false);
  };

  if (loadingState.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <span className="ml-3 text-gray-600">Loading calendar...</span>
      </div>
    );
  }

  if (loadingState.error) {
    return (
      <div className="rounded-lg bg-red-50 p-6">
        <p className="text-red-700">{loadingState.error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={fetchEvents}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <div className="z-10 border-b bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              Today
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('prev')}
                className="hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-1">Previous Week</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateWeek('next')}
                className="hover:bg-gray-100"
              >
                <span className="mr-1">Next Week</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              {formatWeekRange()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Filter */}
            <Popover
              open={showFilterPopover}
              onOpenChange={setShowFilterPopover}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    hasActiveFilters()
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : ''
                  }
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveFilters() && (
                    <Badge
                      variant="secondary"
                      className="ml-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
                    >
                      {Object.values(dateFilter).filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filter Events</h4>
                    {hasActiveFilters() && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="mr-1 h-4 w-4" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Event Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Type</label>
                    <Select
                      value={dateFilter.type || 'all'}
                      onValueChange={(value) =>
                        handleFilterChange(
                          'type',
                          value === 'all' ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value={EventType.INTERVIEW}>
                          Interviews
                        </SelectItem>
                        <SelectItem value={EventType.MEETING}>
                          Meetings
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={dateFilter.status || 'all'}
                      onValueChange={(value) =>
                        handleFilterChange(
                          'status',
                          value === 'all' ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value={EventStatus.PENDING}>
                          Pending
                        </SelectItem>
                        <SelectItem value={EventStatus.CONFIRMED}>
                          Confirmed
                        </SelectItem>
                        <SelectItem value={EventStatus.CANCELLED}>
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Fixed Days Header */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="grid grid-cols-8 bg-gray-50">
            {/* Time column header */}
            <div className="flex h-16 items-center justify-center border-r border-gray-200 bg-white">
              <span className="text-xs font-medium text-gray-500">GMT+7</span>
            </div>

            {/* Day headers */}
            {calendarDays.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              const dayName = day
                .toLocaleDateString('en-US', { weekday: 'short' })
                .toUpperCase();
              const dayNumber = day.getDate();

              return (
                <div
                  key={index}
                  className={`flex h-16 flex-col items-center justify-center border-r border-gray-200 ${
                    isToday ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`text-xs font-medium ${
                      isToday ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {dayName}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      isToday
                        ? 'flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white'
                        : 'text-gray-900'
                    }`}
                  >
                    {dayNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Calendar Body */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="grid min-h-full grid-cols-8">
            {/* Time Column - Fixed */}
            <div className="sticky left-0 z-10 border-r border-gray-200 bg-gray-50">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex h-16 items-center justify-end border-b border-gray-100 pr-2"
                >
                  <span className="text-xs font-medium text-gray-500">
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {calendarDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);

              return (
                <div
                  key={dayIndex}
                  className="relative border-r border-gray-200 bg-white"
                >
                  {/* Time slots */}
                  {timeSlots.map((_slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="h-16 border-b border-gray-100"
                    />
                  ))}

                  {/* Events */}
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`absolute right-1 left-1 cursor-pointer rounded border-l-4 p-2 text-xs shadow-sm transition-shadow hover:shadow-md ${getEventColor(event)}`}
                      style={{
                        top: `${event.topPosition}%`,
                        height: `${Math.max(event.height, 6)}%`, // Increased minimum height for better content
                        zIndex: 10,
                      }}
                      title={`${event.title} - ${new Date(
                        event.startsAt,
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`}
                      onClick={() => handleEventClick(event)}
                    >
                      {/* Event Header with Type and Status */}
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">
                            {getTypeIcon(event.type)}
                          </span>
                          <span className="text-xs font-medium capitalize">
                            {event.type}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <div className="mb-1 truncate font-medium">
                        {event.title}
                      </div>

                      {/* Event Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(event.startsAt).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1 text-xs opacity-75">
                            {event.location.toLowerCase().includes('video') ||
                            event.location.toLowerCase().includes('call') ||
                            event.location.toLowerCase().includes('zoom') ||
                            event.location.toLowerCase().includes('meet') ? (
                              <Video className="h-3 w-3 flex-shrink-0" />
                            ) : (
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="truncate" title={event.location}>
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`rounded-full border px-1.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(event.status)}`}
                      >
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">
                {selectedEvent && getTypeIcon(selectedEvent.type)}
              </span>
              <span>Event Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Event Type and Status */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {selectedEvent.type}
                </Badge>
                <Badge className={getStatusBadgeColor(selectedEvent.status)}>
                  {selectedEvent.status.charAt(0).toUpperCase() +
                    selectedEvent.status.slice(1)}
                </Badge>
              </div>

              {/* Event Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEvent.title}
                </h3>
              </div>

              {/* Event Time */}
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(selectedEvent.startsAt).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(selectedEvent.startsAt).toLocaleTimeString(
                    'en-US',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  )}{' '}
                  -{' '}
                  {new Date(selectedEvent.endsAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Event Location */}
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  {selectedEvent.location.toLowerCase().includes('video') ||
                  selectedEvent.location.toLowerCase().includes('call') ||
                  selectedEvent.location.toLowerCase().includes('zoom') ||
                  selectedEvent.location.toLowerCase().includes('meet') ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {/* Event Notes */}
              {selectedEvent.notes && (
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
                </div>
              )}

              {/* Participants */}
              {selectedEvent.participants &&
                selectedEvent.participants.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-medium text-gray-900">
                      Participants
                    </h4>
                    <div className="space-y-2">
                      {selectedEvent.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                              {participant.user.name
                                ? participant.user.name.charAt(0).toUpperCase()
                                : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {participant.user.name || 'Unknown User'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {participant.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {participant.role}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                participant.response === 'accepted'
                                  ? 'border-green-300 bg-green-100 text-green-800'
                                  : participant.response === 'declined'
                                    ? 'border-red-300 bg-red-100 text-red-800'
                                    : 'border-yellow-300 bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {participant.response.charAt(0).toUpperCase() +
                                participant.response.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              {selectedEvent.status === EventStatus.PENDING && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleConfirmEvent}
                    disabled={isActionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isActionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Confirm
                  </Button>
                  <Button
                    onClick={handleDeclineEvent}
                    disabled={isActionLoading}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {isActionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Decline
                  </Button>
                </div>
              )}

              {/* Close button for non-pending events */}
              {selectedEvent.status !== EventStatus.PENDING && (
                <div className="pt-4">
                  <Button
                    onClick={closeModal}
                    className="w-full"
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
