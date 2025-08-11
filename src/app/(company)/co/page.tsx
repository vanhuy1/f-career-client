'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Briefcase,
  Bell,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  User,
} from 'lucide-react';
import { useUser } from '@/services/state/userSlice';
import { companyService } from '@/services/api/company/company-api';
import { CompanyStats } from '@/types/Company';
import { ApplicationStatus } from '@/enums/applicationStatus';
import {
  ScheduleEventResponse,
  GetScheduleEventsQuery,
} from '@/types/Schedule';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { applicationService } from '@/services/api/applications/application-api';
import { CandidateApplicationDetail } from '@/types/Application';
import { Loader2, Video } from 'lucide-react';
import LoadingState from './job-list/_components/loading-state';

// Keep notifications mocked for now
const dashboardStats = {
  notifications: {
    total: 42,
    unread: 8,
    urgent: 3,
    todayNew: 6,
    weeklyChange: 12.1,
    isIncreasing: true,
  },
};

// Helpers for formatting schedule data
const formatDuration = (startsAt: string, endsAt: string) => {
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const minutes = Math.max(0, Math.round((end - start) / (1000 * 60)));
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
};

const formatRelativeDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(today.getDate() + 1);

  const cmp = (d1: Date, d2: Date) => d1.getTime() === d2.getTime();
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (cmp(dateOnly, today)) return 'Today';
  if (cmp(dateOnly, tomorrow)) return 'Tomorrow';
  return date.toLocaleDateString();
};

const CompanyDashboard = () => {
  const user = useUser();
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEventResponse[]>(
    [],
  );
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<ScheduleEventResponse | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  const [applicationDetail, setApplicationDetail] =
    useState<CandidateApplicationDetail | null>(null);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <User className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return '👤';
      case 'meeting':
        return '📅';
      default:
        return '📋';
    }
  };

  const fetchApplicationDetail = async (applicationId: number) => {
    try {
      setIsLoadingApplication(true);
      const detail = await applicationService.getCandidateApplicationDetail(
        applicationId.toString(),
      );
      setApplicationDetail(detail);
    } catch (error) {
      setApplicationDetail(null);
      console.error(error as string);
    } finally {
      setIsLoadingApplication(false);
    }
  };

  const handleEventClick = (event: ScheduleEventResponse) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setApplicationDetail(null);
    if (event.applicationId) {
      fetchApplicationDetail(event.applicationId);
    }
  };

  // Fetch upcoming schedule events from today onward
  useEffect(() => {
    const fetchEvents = async () => {
      const companyId = user?.data?.companyId;
      if (!companyId) return;
      try {
        setIsLoadingEvents(true);
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const query: GetScheduleEventsQuery = {
          startDate,
          limit: 20,
        };
        const response = await companyService.getEvents(
          Number(companyId),
          query,
        );
        // Keep only future events and sort ascending by start time
        const now = new Date();
        const filtered = (response.data || []).filter(
          (e) => new Date(e.startsAt).getTime() >= now.getTime(),
        );
        filtered.sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        );
        setUpcomingEvents(filtered);
      } catch (err) {
        // fail silently on dashboard; could add toast if desired
        setUpcomingEvents([]);
        console.error(err as string);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [user?.data?.companyId]);

  // Fetch company statistics
  useEffect(() => {
    const fetchStats = async () => {
      const companyId = user?.data?.companyId;
      if (!companyId) return;
      try {
        setIsLoadingStats(true);
        const res = await companyService.getStats(Number(companyId));
        setStats(res);
      } catch (err) {
        setStats(null);
        console.error(err as string);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [user?.data?.companyId]);

  const totalApplications = stats?.totalApplications ?? 0;
  const interviewedCount =
    stats?.applications.byStatus.find(
      (s) => s.status === ApplicationStatus.INTERVIEW,
    )?.count ?? 0;
  const hiredCount =
    stats?.applications.byStatus.find(
      (s) => s.status === ApplicationStatus.HIRED,
    )?.count ?? 0;
  const rejectedCount =
    stats?.applications.byStatus.find(
      (s) => s.status === ApplicationStatus.REJECTED,
    )?.count ?? 0;
  const nonPendingTotal = interviewedCount + hiredCount + rejectedCount;
  const pendingCount = Math.max(0, totalApplications - nonPendingTotal);
  const applicationsToday = stats?.applications.today ?? 0;

  const totalJobs = stats?.totalJobs ?? 0;
  const activeJobs = stats?.jobs.byStatus.active ?? 0;
  const openJobs = stats?.jobs.byStatus.open ?? 0;
  const expiredJobs = stats?.jobs.byStatus.expired ?? 0;

  const calcChangePct = (current: number, previous: number) => {
    if (previous <= 0) return 0;
    return Math.round(((current - previous) / previous) * 1000) / 10; // one decimal
  };

  const applicationsChangePct = stats
    ? calcChangePct(totalApplications, stats.applications.lastMonth)
    : 0;
  const applicationsIsIncreasing = stats
    ? totalApplications >= stats.applications.lastMonth
    : false;

  const jobsChangePct = stats
    ? calcChangePct(totalJobs, stats.jobs.lastMonth)
    : 0;
  const jobsIsIncreasing = stats ? totalJobs >= stats.jobs.lastMonth : false;

  const topFourEvents = useMemo(
    () => upcomingEvents.slice(0, 4),
    [upcomingEvents],
  );

  if (isLoadingEvents) {
    return (
      <>
        <LoadingState />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Company Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your company.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Applications Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? '—' : totalApplications}
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-xs">
              {applicationsIsIncreasing ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  applicationsIsIncreasing ? 'text-green-500' : 'text-red-500'
                }
              >
                {isLoadingStats ? '—' : applicationsChangePct}%
              </span>
              <span>since last month</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-xs">
                <div className="font-semibold text-orange-600">
                  Pending: {isLoadingStats ? '—' : pendingCount}
                </div>
                <div className="font-semibold text-blue-600">
                  Interviewed: {isLoadingStats ? '—' : interviewedCount}
                </div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-green-600">
                  Hired: {isLoadingStats ? '—' : hiredCount}
                </div>
                <div className="font-semibold text-red-600">
                  Rejected: {isLoadingStats ? '—' : rejectedCount}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              +{isLoadingStats ? '—' : applicationsToday} new today
            </div>
          </CardContent>
        </Card>

        {/* Jobs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Postings</CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? '—' : totalJobs}
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-xs">
              {jobsIsIncreasing ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={jobsIsIncreasing ? 'text-green-500' : 'text-red-500'}
              >
                {isLoadingStats ? '—' : Math.abs(jobsChangePct)}%
              </span>
              <span>since last month</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-xs">
                <div className="font-semibold text-green-600">
                  Active: {isLoadingStats ? '—' : activeJobs}
                </div>
                <div className="font-semibold text-yellow-600">
                  Open: {isLoadingStats ? '—' : openJobs}
                </div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-red-600">
                  Expired: {isLoadingStats ? '—' : expiredJobs}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              +{isLoadingStats ? '—' : (stats?.jobs.lastMonth ?? 0)} posted last
              month
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.notifications.total}
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-xs">
              {dashboardStats.notifications.isIncreasing ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  dashboardStats.notifications.isIncreasing
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {dashboardStats.notifications.weeklyChange}%
              </span>
              <span>from last week</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-xs">
                <div className="font-semibold text-blue-600">
                  Unread: {dashboardStats.notifications.unread}
                </div>
                <div className="font-semibold text-red-600">
                  Urgent: {dashboardStats.notifications.urgent}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              +{dashboardStats.notifications.todayNew} new today
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Summary
            </CardTitle>
            <p className="mt-1 text-sm text-gray-600">
              Upcoming interviews and meetings
            </p>
          </div>
          <Link href="/co/schedule">
            <Button variant="outline" size="sm">
              View Full Schedule
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFourEvents.map((event) => (
              <div
                key={event.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border bg-gray-50 p-3 hover:bg-gray-100"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.startsAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        ({formatDuration(event.startsAt, event.endsAt)})
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {formatRelativeDate(event.startsAt)}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          {upcomingEvents.length > 4 && (
            <div className="mt-4 text-center">
              <Link href="/co/schedule">
                <Button variant="ghost" size="sm">
                  View {upcomingEvents.length - 4} more events
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
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
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {selectedEvent.type}
                </Badge>
                <Badge className={getStatusBadgeColor(selectedEvent.status)}>
                  {selectedEvent.status.charAt(0).toUpperCase() +
                    selectedEvent.status.slice(1)}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEvent.title}
                </h3>
              </div>

              {selectedEvent.applicationId && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    Application Details
                  </h4>
                  {isLoadingApplication ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading application details...</span>
                    </div>
                  ) : applicationDetail ? (
                    <div className="space-y-2 rounded-lg border border-gray-200 p-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Job Title:
                        </span>
                        <p className="text-sm text-gray-900">
                          {applicationDetail.job?.title || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Company:
                        </span>
                        <p className="text-sm text-gray-900">
                          {applicationDetail.company?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Failed to load application details
                    </p>
                  )}
                </div>
              )}

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

              {selectedEvent.notes && (
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
                </div>
              )}

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

              <div className="pt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-gray-600">Common tasks and shortcuts</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Link href="/co/post-job">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col items-center justify-center space-y-2"
              >
                <Briefcase className="h-6 w-6" />
                <span className="text-sm">Post New Job</span>
              </Button>
            </Link>
            <Link href="/co/applicant-list">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col items-center justify-center space-y-2"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">View Applicants</span>
              </Button>
            </Link>
            <Link href="/co/schedule">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col items-center justify-center space-y-2"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </Button>
            </Link>
            <Link href="/co/profile">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col items-center justify-center space-y-2"
              >
                <User className="h-6 w-6" />
                <span className="text-sm">Company Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDashboard;
