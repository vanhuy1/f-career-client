'use client';

import { useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/app/(candidate)/_components/applications-list/StatusBadge';
import Image from 'next/image';
import { useAppDispatch } from '@/store/hooks';
import {
  setApplicationDetailFailure,
  setApplicationDetailStart,
  setApplicationDetailSuccess,
  useApplicationDetailById,
  useApplicationDetailsErrors,
  useApplicationDetailsLoadingState,
  useSelectedApplication,
  clearSelectedApplication,
} from '@/services/state/applicationsSlice';
import { LoadingState } from '@/store/store.model';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const applicationId = params?.id as string;

  // Get application from both sources
  const applicationFromDetail = useApplicationDetailById(applicationId);
  const selectedApplication = useSelectedApplication();

  // Use selected application if it matches the ID, otherwise use the one from details
  const application =
    selectedApplication && selectedApplication.id === applicationId
      ? selectedApplication
      : applicationFromDetail;

  const loading = useApplicationDetailsLoadingState() === LoadingState.loading;
  const error = useApplicationDetailsErrors();

  useEffect(() => {
    const loadApplicationDetail = async () => {
      dispatch(setApplicationDetailStart());
      try {
        // const response = await applicationService.getApplication(applicationId);
        // dispatch(setApplicationDetailSuccess(response));
      } catch (error) {
        dispatch(setApplicationDetailFailure(error as string));
      }
    };

    // Only fetch if we don't already have the application data
    if (!application) {
      loadApplicationDetail();
    } else if (
      selectedApplication &&
      selectedApplication.id === applicationId
    ) {
      // If we're using the selected application, save it to the details too
      dispatch(setApplicationDetailSuccess(selectedApplication));
    }

    // Clear selected application when leaving the page
    return () => {
      dispatch(clearSelectedApplication());
    };
  }, [applicationId, dispatch, application, selectedApplication]);

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
              {application.job?.company.logoUrl ? (
                <Image
                  src={application.job?.company.logoUrl || '/placeholder.svg'}
                  alt={application.job.company.companyName}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <span className="text-xl text-gray-400">
                  {application.job?.company.companyName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{application.job.title}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-gray-600">
                  {application.job?.company.companyName}
                </span>
                <StatusBadge
                  status={
                    application.status as import('@/types/Application').ApplicationStatus
                  }
                />
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
                  <p className="text-gray-600">
                    {application.job?.description}
                  </p>
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
                              Number(application.job.salaryMin),
                              Number(application.job.salaryMax),
                              'USD', // Adjust if currency is available in data
                            )
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      {/* Location data can be added here if available */}
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
                          : 'Not specified'}
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

                {/* <div className="pt-4">
                  <h3 className="mb-2 font-medium text-gray-900">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.job?.?.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {typeof skill === 'string' ? skill : skill.name}
                      </Badge>
                    ))}
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Uncomment and implement if contacts/documents data is provided */}
          {/* <Tabs defaultValue="contacts" className="mb-6">
            <TabsList className="mb-4 grid grid-cols-2">
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="contacts">
              <ContactsSection contacts={application.job?.company.email} />
            </TabsContent>
            <TabsContent value="documents">
              <DocumentsSection documents={application.documents} />
            </TabsContent>
          </Tabs> */}
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
                  <p className="font-medium">
                    {application.job?.company.companyName}
                  </p>
                </div>
                {application.job?.company.address && (
                  <div>
                    <h3 className="text-sm text-gray-500">Website</h3>
                    <a
                      href={application.job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {/* {application.job.company.website.replace(/^https?:\/\//, '')} */}
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
                    <StatusBadge
                      status={
                        application.status as import('@/types/Application').ApplicationStatus
                      }
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
