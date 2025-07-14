import React from 'react';
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

// Mock data for dashboard statistics
const dashboardStats = {
  applications: {
    total: 247,
    pending: 89,
    interviewed: 35,
    hired: 12,
    rejected: 111,
    todayNew: 15,
    weeklyChange: 8.5,
    isIncreasing: true,
  },
  jobs: {
    total: 23,
    active: 18,
    draft: 3,
    expired: 2,
    todayPosted: 2,
    weeklyChange: -3.2,
    isIncreasing: false,
  },
  notifications: {
    total: 42,
    unread: 8,
    urgent: 3,
    todayNew: 6,
    weeklyChange: 12.1,
    isIncreasing: true,
  },
};

// Mock data for schedule
const scheduleEvents = [
  {
    id: 1,
    title: 'Interview with Sarah Johnson',
    type: 'interview',
    time: '09:00 AM',
    duration: '1 hour',
    date: 'Today',
    location: 'Conference Room A',
    candidate: 'Sarah Johnson',
    position: 'Frontend Developer',
    status: 'confirmed',
  },
  {
    id: 2,
    title: 'Team Meeting',
    type: 'meeting',
    time: '02:00 PM',
    duration: '30 mins',
    date: 'Today',
    location: 'Virtual Meeting',
    status: 'confirmed',
  },
  {
    id: 3,
    title: 'Interview with Michael Chen',
    type: 'interview',
    time: '10:30 AM',
    duration: '1 hour',
    date: 'Tomorrow',
    location: 'Conference Room B',
    candidate: 'Michael Chen',
    position: 'Backend Developer',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Quarterly Review',
    type: 'meeting',
    time: '03:00 PM',
    duration: '2 hours',
    date: 'Tomorrow',
    location: 'Main Conference Room',
    status: 'confirmed',
  },
];

const CompanyDashboard = () => {
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
              {dashboardStats.applications.total}
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-xs">
              {dashboardStats.applications.isIncreasing ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  dashboardStats.applications.isIncreasing
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {dashboardStats.applications.weeklyChange}%
              </span>
              <span>from last week</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-xs">
                <div className="font-semibold text-orange-600">
                  Pending: {dashboardStats.applications.pending}
                </div>
                <div className="font-semibold text-blue-600">
                  Interviewed: {dashboardStats.applications.interviewed}
                </div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-green-600">
                  Hired: {dashboardStats.applications.hired}
                </div>
                <div className="font-semibold text-red-600">
                  Rejected: {dashboardStats.applications.rejected}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              +{dashboardStats.applications.todayNew} new today
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
              {dashboardStats.jobs.total}
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-xs">
              {dashboardStats.jobs.isIncreasing ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={
                  dashboardStats.jobs.isIncreasing
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {Math.abs(dashboardStats.jobs.weeklyChange)}%
              </span>
              <span>from last week</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-xs">
                <div className="font-semibold text-green-600">
                  Active: {dashboardStats.jobs.active}
                </div>
                <div className="font-semibold text-yellow-600">
                  Draft: {dashboardStats.jobs.draft}
                </div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-red-600">
                  Expired: {dashboardStats.jobs.expired}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              +{dashboardStats.jobs.todayPosted} posted today
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
            {scheduleEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
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
                        {event.time} ({event.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </div>
                    {event.candidate && (
                      <div className="mt-1 text-xs text-gray-500">
                        Candidate: {event.candidate} • Position:{' '}
                        {event.position}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {event.date}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          {scheduleEvents.length > 4 && (
            <div className="mt-4 text-center">
              <Link href="/co/schedule">
                <Button variant="ghost" size="sm">
                  View {scheduleEvents.length - 4} more events
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

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
