'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { DetailedApplication } from '@/types/Application';
import { fetchApplicationDetail } from '@/app/(candidate)/_components/applications-list/utils/api';
import StatusBadge from '@/app/(candidate)/_components/applications-list/StatusBadge';
import TimelineSection from '@/app/(candidate)/_components/applications-list/TimelineSection';
import ContactsSection from '@/app/(candidate)/_components/applications-list/ContactsSection';
import NotesSection from '@/app/(candidate)/_components/applications-list/NotesSection';
import DocumentsSection from '@/app/(candidate)/_components/applications-list/DocumentsSection';
import Image from 'next/image';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<DetailedApplication | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApplicationDetail = async () => {
      setLoading(true);
      try {
        const applicationId = Number(params?.id);
        if (isNaN(applicationId)) {
          throw new Error('Invalid application ID');
        }

        const response = await fetchApplicationDetail({ applicationId });
        setApplication(response.application);
      } catch (err) {
        setError('Failed to load application details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplicationDetail();
  }, [params?.id]);

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

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
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
              {application.company.logo ? (
                <Image
                  src={application.company.logo || '/placeholder.svg'}
                  alt={application.company.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <span className="text-xl text-gray-400">
                  {application.company.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{application.role}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-gray-600">
                  {application.company.name}
                </span>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Withdraw</Button>
            <Button>Follow Up</Button>
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
                  <p className="text-gray-600">{application.jobDescription}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Salary Range</p>
                      <p className="font-medium">
                        {application.salaryRange
                          ? formatSalary(
                              application.salaryRange.min,
                              application.salaryRange.max,
                              application.salaryRange.currency,
                            )
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {application.location.type.charAt(0).toUpperCase() +
                          application.location.type.slice(1)}
                        {application.location.city &&
                          `, ${application.location.city}`}
                        {application.location.state &&
                          `, ${application.location.state}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Employment Type</p>
                      <p className="font-medium">
                        {application.employmentType.charAt(0).toUpperCase() +
                          application.employmentType.slice(1).replace('-', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="font-medium">
                        {new Date(application.dateApplied).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="mb-2 font-medium text-gray-900">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="timeline" className="mb-6">
            <TabsList className="mb-4 grid grid-cols-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <TimelineSection
                timeline={application.timeline}
                applicationId={application.id}
              />
            </TabsContent>
            <TabsContent value="contacts">
              <ContactsSection contacts={application.contacts} />
            </TabsContent>
            <TabsContent value="notes">
              <NotesSection
                notes={application.notes}
                applicationId={application.id}
              />
            </TabsContent>
            <TabsContent value="documents">
              <DocumentsSection documents={application.documents} />
            </TabsContent>
          </Tabs>
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
                {application.company.industry && (
                  <div>
                    <h3 className="text-sm text-gray-500">Industry</h3>
                    <p className="font-medium">
                      {application.company.industry}
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
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {application.company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
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
                    <StatusBadge status={application.status} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Applied On</h3>
                  <p className="font-medium">
                    {new Date(application.dateApplied).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Last Updated</h3>
                  <p className="font-medium">
                    {application.timeline.length > 0
                      ? new Date(
                          application.timeline[0].date,
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Follow-up Status</h3>
                  <p className="font-medium">
                    {application.hasFollowedUp
                      ? 'Followed up'
                      : 'No follow-up yet'}
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
