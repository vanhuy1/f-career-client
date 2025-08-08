'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/app/(candidate)/_components/applications-list/StatusBadge';
import { createSafeHtml } from '@/utils/html-sanitizer';
import { applicationService } from '@/services/api/applications/application-api';
import {
  CandidateApplicationDetail,
  ApplicationStatus,
} from '@/types/Application';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params?.id as string;

  const [application, setApplication] =
    useState<CandidateApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApplicationDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response =
          await applicationService.getCandidateApplicationDetail(applicationId);
        setApplication(response);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load application details',
        );
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      loadApplicationDetail();
    }
  }, [applicationId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <ApplicationDetailSkeleton />;
  }

  if (error || !application) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
        </Button>
        <div className="flex h-64 items-center justify-center">
          <div className="text-red-500">{error || 'Application not found'}</div>
        </div>
      </div>
    );
  }

  const formatSalary = (min: string, max: string, currency: string = 'USD') => {
    return `${currency} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
      </Button>

      {/* Header Section */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-gray-100">
              {application.company.logoUrl ? (
                <Image
                  src={application.company.logoUrl}
                  alt={application.company.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xl text-gray-400">
                  {application.company.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{application.job.title}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-gray-600">
                  {application.company.name}
                </span>
                <StatusBadge status={application.status as ApplicationStatus} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Job Details */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Information about the position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Description
                  </h3>
                  {application.job?.description && (
                    <div
                      className="prose max-w-none text-gray-600"
                      dangerouslySetInnerHTML={createSafeHtml(
                        application.job.description,
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Salary Range</p>
                      <p className="font-medium">
                        {application.job?.salaryMax &&
                        application.job?.salaryMin
                          ? formatSalary(
                              application.job.salaryMin,
                              application.job.salaryMax,
                              'USD',
                            )
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{application.job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Employment Type</p>
                      <p className="font-medium">
                        {application.job?.typeOfEmployment
                          ? application.job.typeOfEmployment
                              .charAt(0)
                              .toUpperCase() +
                            application.job.typeOfEmployment
                              .slice(1)
                              .replace('-', ' ')
                          : 'Full-time'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="font-medium">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Schedule Section */}
          {(application.interviewSchedule ||
            application.interviewSchedules?.length) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Interview Schedule</CardTitle>
                <CardDescription>Your upcoming interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.interviewSchedule && (
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {application.interviewSchedule.title}
                          </h4>
                          <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDateTime(
                                  application.interviewSchedule.startsAt,
                                )}{' '}
                                -{' '}
                                {new Date(
                                  application.interviewSchedule.endsAt,
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {application.interviewSchedule.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                Status: {application.interviewSchedule.status}
                              </span>
                            </div>
                          </div>
                          {application.interviewSchedule.notes && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                <strong>Notes:</strong>{' '}
                                {application.interviewSchedule.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {application.interviewSchedules?.map((interview, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {interview.title}
                          </h4>
                          <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDateTime(interview.startsAt)} -{' '}
                                {new Date(
                                  interview.endsAt,
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{interview.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Status: {interview.status}</span>
                            </div>
                          </div>
                          {interview.notes && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                <strong>Notes:</strong> {interview.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Company Info */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500">Company Name</h3>
                  <p className="font-medium">{application.company.name}</p>
                </div>
                {application.company.contact &&
                  application.company.contact.length > 0 && (
                    <div>
                      <h3 className="text-sm text-gray-500">Address</h3>
                      <p className="font-medium">
                        {application.company.contact.join(', ')}
                      </p>
                    </div>
                  )}
                {application.company.website && (
                  <div>
                    <h3 className="text-sm text-gray-500">Website</h3>
                    <a
                      href={application.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-black hover:underline"
                    >
                      {application.company.website}
                    </a>
                  </div>
                )}
                {application.company.email && (
                  <div>
                    <h3 className="text-sm text-gray-500">Email</h3>
                    <p className="font-medium">{application.company.email}</p>
                  </div>
                )}
                {/* {application.company.about && (
                  <div>
                    <h3 className="text-sm text-gray-500">About</h3>
                    <p className="text-sm text-gray-600">{application.company.about}</p>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500">Current Status</h3>
                  <div className="mt-1">
                    <StatusBadge
                      status={application.status as ApplicationStatus}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Applied On</h3>
                  <p className="font-medium">
                    {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Last Updated</h3>
                  <p className="font-medium">
                    {application.updated_at
                      ? new Date(application.updated_at).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ApplicationDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4">
        <Skeleton className="h-10 w-40" />
      </div>
      <Skeleton className="mb-6 h-32 w-full" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Skeleton className="mb-6 h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div>
          <Skeleton className="mb-6 h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
