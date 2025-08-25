'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  XCircle,
  AlertTriangle,
  Building,
  RefreshCw,
  Home,
  CreditCard,
  FileText,
} from 'lucide-react';

interface JobFormData {
  title: string;
  description: string;
  categoryId: string;
  skillIds: string[];
  benefits: { description: string }[];
  location: string;
  salaryRange: [number, number];
  experienceYears: number;
  isVip: boolean;
  packageInfo: string;
  deadline: string;
  typeOfEmployment: string;
  priorityPosition: number;
}

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobData, setJobData] = useState<JobFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failureReason, setFailureReason] = useState<string>(
    'Payment was not completed',
  );

  useEffect(() => {
    const status = searchParams?.get('status');
    const cancel = searchParams?.get('cancel');

    // Retrieve payment data from localStorage
    const storedData = localStorage.getItem('JOB_FORM_DATA');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setJobData(data);
        console.log('Job form data loaded:', data);
      } catch (error) {
        console.error('Failed to parse job form data:', error);
      }
    }

    // Determine failure reason
    if (cancel === 'true') {
      setFailureReason('Payment was cancelled by user');
    } else if (status === 'FAILED') {
      setFailureReason('Payment failed due to technical issues');
    } else {
      setFailureReason('Payment was not completed successfully');
    }

    setIsLoading(false);
  }, [searchParams]);

  const handleRetryJob = () => {
    router.push('/co/post-job');
  };

  const handleGoToCompanyJobs = () => {
    router.push('/co/job-list');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-br from-red-100 to-pink-100 p-3">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Job Payment Failed
            </h1>
          </div>
          <p className="mb-2 text-lg text-gray-600">{failureReason}</p>
          <p className="text-sm text-gray-500">
            Don&apos;t worry, your job data is safe and you can try again
            anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Payment Details */}
          <div className="lg:col-span-2">
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <CreditCard className="h-5 w-5" />
                  Job Posting Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobData ? (
                  <>
                    {/* Job Info */}
                    <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 p-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {jobData.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {jobData.location}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          jobData.isVip
                            ? 'border-purple-300 bg-purple-50 text-purple-700'
                            : 'border-blue-300 bg-blue-50 text-blue-700'
                        }
                      >
                        {jobData.isVip ? 'VIP' : 'Standard'}
                      </Badge>
                    </div>

                    {/* Package Info */}
                    <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg bg-gradient-to-br from-${jobData.isVip ? 'purple' : 'blue'}-100 to-${jobData.isVip ? 'pink' : 'cyan'}-100 p-2`}
                        >
                          {jobData.isVip ? (
                            <FileText className="h-5 w-5 text-purple-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {jobData.isVip
                              ? 'VIP Job Package'
                              : 'Standard Job Package'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {jobData.isVip
                              ? 'Enhanced visibility and priority'
                              : 'Standard job posting'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Features */}
                    <div className="rounded-lg bg-white/60 p-4">
                      <h4 className="mb-3 font-semibold text-gray-900">
                        Job Features Included:
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {jobData.isVip
                              ? 'Enhanced visibility and priority ranking'
                              : 'Standard job posting visibility'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {jobData.isVip
                              ? 'VIP badge and special highlighting'
                              : 'Professional job listing appearance'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {jobData.isVip
                              ? 'Top position in search results'
                              : 'Searchable job listing'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {jobData.isVip
                              ? '24/7 priority support'
                              : 'Standard customer support'}
                          </span>
                        </div>
                        {jobData.isVip && (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                            <span>Featured on homepage spotlight</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-400" />
                    <p className="text-gray-600">
                      No job data available. Please try the payment process
                      again.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-2">
            <Card className="border-red-200 bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-900">
                  What would you like to do?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Retry Payment */}
                  <Button
                    onClick={handleRetryJob}
                    className="h-12 w-full bg-gradient-to-r from-blue-500 to-cyan-600 font-semibold text-white shadow-xl hover:from-blue-600 hover:to-cyan-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>

                  {/* Go to Company Jobs */}
                  <Button
                    onClick={handleGoToCompanyJobs}
                    variant="outline"
                    className="h-12 w-full border-red-300 font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    Manage Jobs
                  </Button>

                  {/* Go Home */}
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="h-12 w-full border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </div>

                {/* Help Text */}
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="mb-2 text-sm text-gray-600">
                    Need help with your payment?
                  </p>
                  <p className="text-xs text-gray-500">
                    Contact our support team or check your payment method
                    details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <Card className="border-gray-200 bg-white">
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                <span>Job data is temporarily stored</span>
              </div>
              <p className="text-xs text-gray-500">
                Your job information is saved locally and will be cleared when
                you complete a successful payment or navigate away from this
                page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
