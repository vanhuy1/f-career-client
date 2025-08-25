'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  XCircle,
  AlertTriangle,
  Star,
  Building,
  RefreshCw,
  Home,
  CreditCard,
} from 'lucide-react';

interface TopJobData {
  jobId: string;
  newTopJob: number;
  topJobExpired: string;
  amount?: number;
  durationDays?: number;
}

export default function TopJobPaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [topJobData, setTopJobData] = useState<TopJobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failureReason, setFailureReason] = useState<string>(
    'Payment was not completed',
  );

  useEffect(() => {
    const status = searchParams?.get('status');
    const cancel = searchParams?.get('cancel');

    // Retrieve payment data from localStorage
    const storedData = localStorage.getItem('TOP_JOB_DATA');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setTopJobData(data);
        console.log('Top job data loaded:', data);
      } catch (error) {
        console.error('Failed to parse top job data:', error);
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

  const handleRetryTopJob = () => {
    // Get the job ID from localStorage if available
    const savedData = localStorage.getItem('TOP_JOB_DATA');
    if (savedData) {
      const topJobData = JSON.parse(savedData);
      router.push(`/co/job-list/${topJobData.jobId}/top-job`);
    } else {
      router.push('/co/job-list');
    }
  };

  const handleGoToCompanyJobs = () => {
    router.push('/co/job-list');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
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
              Top Job Payment Failed
            </h1>
          </div>
          <p className="mb-2 text-lg text-gray-600">{failureReason}</p>
          <p className="text-sm text-gray-500">
            Don&apos;t worry, your payment data is safe and you can try again
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
                  Top Job Package Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topJobData ? (
                  <>
                    {/* Package Info */}
                    <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 p-2">
                          <Star className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Top Job Spotlight Package
                          </div>
                          <div className="text-sm text-gray-600">
                            Homepage Featured Position
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-amber-300 bg-amber-50 text-amber-700"
                      >
                        Position #{topJobData.newTopJob}
                      </Badge>
                    </div>

                    {/* Pricing */}
                    {topJobData.amount && (
                      <div className="rounded-lg bg-white/60 p-4">
                        <div className="text-center">
                          <div className="mb-1 text-2xl font-bold text-red-900">
                            {formatVND(topJobData.amount)}
                          </div>
                          <div className="text-sm text-red-700">
                            Total payment amount
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div className="rounded-lg bg-white/60 p-4">
                      <h4 className="mb-3 font-semibold text-gray-900">
                        Top Job Features Included:
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                          <span>Featured on homepage spotlight</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                          <span>Higher visibility to candidates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                          <span>Priority position in search results</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                          <span>Enhanced job listing appearance</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-400" />
                    <p className="text-gray-600">
                      No payment data available. Please try the payment process
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
                    onClick={handleRetryTopJob}
                    className="h-12 w-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-white shadow-xl hover:from-amber-600 hover:to-orange-700"
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
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Payment data is temporarily stored</span>
              </div>
              <p className="text-xs text-gray-500">
                Your payment information is saved locally and will be cleared
                when you complete a successful payment or navigate away from
                this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
