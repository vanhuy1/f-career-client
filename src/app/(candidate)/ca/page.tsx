'use client';

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  TrendingUp,
  Users,
  FileText,
  Clock,
  MapPin,
  Building2,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusChart from '../_components/status-chart';
import ROUTES from '@/constants/navigation';
import { useUser } from '@/services/state/userSlice';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  setApplicationDetailStart,
  setApplicationFailure,
  setApplicationSuccess,
  useApplicationList,
  useApplicationListLoadingState,
} from '@/services/state/applicationsSlice';
import { LoadingState } from '@/store/store.model';
import { applicationService } from '@/services/api/applications/application-api';
import { ApplicationStatus } from '@/enums/applicationStatus';
import type { Application } from '@/types/Application';
import { formatDate } from '@/utils/helpers';

// Mock data for stats and chart (will be replaced with real API data later)
const mockStatsData = {
  upcomingInterviews: [
    {
      id: 1,
      time: '10:30 AM',
      interviewer: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      company: 'TechCorp',
      logo: '/logo-landing/nomad.png',
      type: 'Video Call',
      duration: '45 min',
    },
    {
      id: 2,
      time: '2:00 PM',
      interviewer: 'Michael Chen',
      position: 'UX Designer',
      company: 'DesignHub',
      logo: '/logo-landing/udacity.png',
      type: 'Phone Call',
      duration: '30 min',
    },
  ],
  weeklyProgress: {
    applicationsThisWeek: 8,
    lastWeek: 5,
    interviewsThisWeek: 3,
    responsesThisWeek: 12,
  },
};

export default function Dashboard() {
  const user = useUser();
  const dispatch = useAppDispatch();
  const applications = useApplicationList();
  const loading = useApplicationListLoadingState() === LoadingState.loading;

  // Load applications from API
  useEffect(() => {
    const loadApplications = async () => {
      try {
        dispatch(setApplicationDetailStart());
        const response = await applicationService.getApplications();
        dispatch(setApplicationSuccess(response.data || []));
      } catch (err) {
        dispatch(setApplicationFailure(err as string));
      }
    };
    if (applications?.length === 0) {
      loadApplications();
    }
  }, [applications?.length, dispatch]);

  // Calculate stats from real application data
  const stats = useMemo(() => {
    if (!applications || applications.length === 0) {
      return {
        totalApplications: 0,
        interviewed: 0,
        inReview: 0,
        shortlisted: 0,
        declined: 0,
      };
    }

    const statusCounts = applications.reduce(
      (acc, app) => {
        const status = app.status as ApplicationStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    return {
      totalApplications: applications.length,
      interviewed: statusCounts[ApplicationStatus.INTERVIEW] || 0,
      inReview: statusCounts[ApplicationStatus.APPLIED] || 0,
      shortlisted: statusCounts[ApplicationStatus.HIRED] || 0,
      declined: statusCounts[ApplicationStatus.REJECTED] || 0,
    };
  }, [applications]);

  const chartData = useMemo(() => {
    if (!applications || applications.length === 0) {
      return {
        unsuitable: 0,
        interviewed: 0,
        inReview: 0,
        shortlisted: 0,
      };
    }

    const total = applications.length;
    const statusCounts = applications.reduce(
      (acc, app) => {
        const status = app.status as ApplicationStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    );

    return {
      unsuitable: Math.round(
        ((statusCounts[ApplicationStatus.REJECTED] || 0) / total) * 100,
      ),
      interviewed: Math.round(
        ((statusCounts[ApplicationStatus.INTERVIEW] || 0) / total) * 100,
      ),
      inReview: Math.round(
        ((statusCounts[ApplicationStatus.APPLIED] || 0) / total) * 100,
      ),
      shortlisted: Math.round(
        ((statusCounts[ApplicationStatus.HIRED] || 0) / total) * 100,
      ),
    };
  }, [applications]);

  // Get recent applications (last 4)
  const recentApplications = useMemo(() => {
    if (!applications || applications.length === 0) return [];

    return [...applications]
      .sort(
        (a, b) =>
          new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime(),
      )
      .slice(0, 4);
  }, [applications]);

  const progressPercentage = useMemo(() => {
    return stats.totalApplications > 0
      ? Math.round((stats.interviewed / stats.totalApplications) * 100)
      : 0;
  }, [stats]);

  const weeklyGrowth = useMemo(() => {
    const { weeklyProgress } = mockStatsData;
    const growth =
      weeklyProgress.applicationsThisWeek - weeklyProgress.lastWeek;
    return weeklyProgress.lastWeek > 0
      ? (growth / weeklyProgress.lastWeek) * 100
      : 0;
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full justify-center bg-gray-50/50">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-50/50">
      <main className="w-[95%] max-w-7xl p-6">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Good morning, {user?.data.name || 'User'} 👋
            </h1>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your job search journey
              today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Week
            </Button>
            <Button className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.totalApplications}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />+{weeklyGrowth.toFixed(1)}
                    % this week
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" />
                Interviewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.interviewed}
                  </div>
                  <div className="text-sm text-gray-600">
                    {progressPercentage}% of applications
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                In Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.inReview}
                  </div>
                  <div className="text-sm text-gray-600">Pending responses</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <TrendingUp className="h-4 w-4" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {progressPercentage}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Interview conversion
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Interviews Row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Application Status Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Application Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <StatusChart
                  unsuitable={chartData.unsuitable}
                  interviewed={chartData.interviewed}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                  <span>Interviewed: {chartData.interviewed}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span>In Review: {chartData.inReview}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  <span>Declined: {chartData.unsuitable}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Shortlisted: {chartData.shortlisted}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Interviews
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-medium text-gray-900">
                    Today,{' '}
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                </div>
                {mockStatsData.upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="min-w-[4rem] text-sm font-medium text-gray-600">
                      {interview.time}
                    </div>
                    <div className="flex flex-1 items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={interview.logo}
                          alt={interview.company}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {interview.interviewer}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {interview.position} at {interview.company}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{interview.type}</span>
                          <span>•</span>
                          <span>{interview.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <ApplicationItem
                    key={application.id}
                    application={application}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No applications yet. Start applying to jobs!
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <Link
                href={ROUTES.CA.HOME.APPLICATIONLIST.path}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View all applications
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

interface ApplicationItemProps {
  application: Application;
}

function ApplicationItem({ application }: ApplicationItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'INTERVIEW':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIRED':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'Applied';
      case 'INTERVIEW':
        return 'Interviewing';
      case 'REJECTED':
        return 'Rejected';
      case 'HIRED':
        return 'Hired';
      default:
        return status;
    }
  };

  const formatSalary = (min: string, max: string) => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    return `$${minNum.toLocaleString()} - $${maxNum.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          <Image
            src={application.company?.logoUrl || '/placeholder.svg'}
            alt={`${application.company?.companyName || 'Company'} logo`}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">
            {application.job?.title}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-3 w-3" />
            <span>{application.company?.companyName}</span>
            <span>•</span>
            <MapPin className="h-3 w-3" />
            <span>{application.job?.location}</span>
            <span>•</span>
            <span>{application.job?.typeOfEmployment}</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {formatSalary(
              application.job?.salaryMin || '0',
              application.job?.salaryMax || '0',
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {formatDate(application.applied_at)}
          </div>
          <div className="text-xs text-gray-500">
            #{application.id.slice(-8)}
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${getStatusColor(application.status)} text-xs font-medium`}
        >
          {getStatusLabel(application.status)}
        </Badge>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
