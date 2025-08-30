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
  TrendingUp,
  Crown,
  Star,
} from 'lucide-react';
import { paymentHistoryService } from '@/services/api/payment/payment-history-api';
import { useUserData } from '@/services/state/userSlice';

interface VisibilityPackageData {
  jobId: string;
  packageType: 'vip' | 'premium';
  durationDays: number;
  priorityPosition: number;
  vipExpired: string;
  amount?: number;
  coupon?: {
    id: number;
    code: string;
    discountPercentage: number;
  } | null;
}

export default function VisibilityPaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userData = useUserData();
  const [packageData, setPackageData] = useState<VisibilityPackageData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [failureReason, setFailureReason] = useState<string>(
    'Payment was not completed',
  );
  const [hasProcessedPayment, setHasProcessedPayment] = useState(false);

  useEffect(() => {
    const orderCode = searchParams?.get('orderCode');
    const status = searchParams?.get('status');
    const cancel = searchParams?.get('cancel');

    // Retrieve payment data from localStorage
    const storedData = localStorage.getItem('VISIBILITY_PACKAGE_DATA');
    if (!storedData) {
      console.log('No visibility package data found in localStorage');
      setFailureReason('No payment data found. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setPackageData(data);
      console.log('Visibility package data loaded:', data);

      // Prevent duplicate processing
      if (hasProcessedPayment) {
        console.log('Payment already processed, skipping...');
        setIsLoading(false);
        return;
      }

      // Determine failure reason
      let failureReasonText = 'Payment was not completed successfully';

      if (cancel === 'true') {
        failureReasonText = 'Payment was cancelled by user';
      } else if (status === 'FAILED') {
        failureReasonText = 'Payment failed due to technical issues';
      }

      setFailureReason(failureReasonText);

      // Create payment record with FAILED status
      const createFailedPayment = async () => {
        try {
          const packageType = data.packageType === 'vip' ? 3 : 4; // VIP_JOB = 3, PREMIUM_JOB = 4
          await paymentHistoryService.createPayment({
            userId: Number(userData?.id) || 0,
            packageType: packageType,
            couponId: data.coupon?.id ? Number(data.coupon.id) : undefined,
            amount: data.amount || 0,
            paymentMethod: 'PAYOS',
            status: 'FAILED',
            transactionId: orderCode || undefined,
          });
          console.log('Failed visibility payment record created successfully');
        } catch (error) {
          console.error('Failed to create payment record:', error);
        }
      };

      // Create failed payment record
      createFailedPayment();
      setHasProcessedPayment(true);
    } catch (error) {
      console.error('Failed to parse visibility package data:', error);
      setFailureReason('Invalid payment data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, hasProcessedPayment, userData]);

  const handleRetryVisibility = () => {
    router.push('/co/job-list');
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
              Visibility Package Payment Failed
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
                  Visibility Package Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {packageData ? (
                  <>
                    {/* Package Info */}
                    <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg bg-gradient-to-br from-${packageData.packageType === 'vip' ? 'purple' : 'blue'}-100 to-${packageData.packageType === 'vip' ? 'pink' : 'cyan'}-100 p-2`}
                        >
                          {packageData.packageType === 'vip' ? (
                            <Crown className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Star className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {packageData.packageType === 'vip'
                              ? 'VIP Visibility Package'
                              : 'Premium Visibility Package'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {packageData.packageType === 'vip'
                              ? 'Maximum visibility and priority'
                              : 'Enhanced visibility and features'}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          packageData.packageType === 'vip'
                            ? 'border-purple-300 bg-purple-50 text-purple-700'
                            : 'border-blue-300 bg-blue-50 text-blue-700'
                        }
                      >
                        {packageData.packageType === 'vip' ? 'VIP' : 'Premium'}
                      </Badge>
                    </div>

                    {/* Duration & Amount */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-white/60 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Duration
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {packageData.durationDays} day(s)
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/60 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Amount
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {packageData.amount?.toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </div>

                    {/* Coupon Info */}
                    {packageData.coupon && (
                      <div className="rounded-lg bg-white/60 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Applied Coupon
                          </span>
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">
                            {packageData.coupon.code}
                          </span>{' '}
                          (-{packageData.coupon.discountPercentage}% OFF)
                        </div>
                      </div>
                    )}

                    {/* Package Features */}
                    <div className="rounded-lg bg-white/60 p-4">
                      <h4 className="mb-3 font-semibold text-gray-900">
                        Package Features:
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {packageData.packageType === 'vip'
                              ? 'Maximum priority in search results'
                              : 'Enhanced search visibility'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {packageData.packageType === 'vip'
                              ? 'VIP badge and special highlighting'
                              : 'Premium badge and enhanced appearance'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {packageData.packageType === 'vip'
                              ? 'Top position in job listings'
                              : 'Improved ranking in job listings'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            {packageData.packageType === 'vip'
                              ? '24/7 priority support'
                              : 'Enhanced customer support'}
                          </span>
                        </div>
                        {packageData.packageType === 'vip' && (
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
                      No package data available. Please try the payment process
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
                    onClick={handleRetryVisibility}
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
                <span>Package data is temporarily stored</span>
              </div>
              <p className="text-xs text-gray-500">
                Your visibility package information is saved locally and will be
                cleared when you complete a successful payment or navigate away
                from this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
