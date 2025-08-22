'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Home,
  CreditCard,
} from 'lucide-react';
import { Coupon } from '@/services/api/coupons/coupon-api';

interface TopCompanyPaymentData {
  amountVnd: number;
  coupon: Coupon;
  companyId: string;
  durationDays: number;
  priorityPosition: number;
  vipExpired: string;
  isExtension: boolean;
  packageType: string;
  basePricePerDay: number;
  timestamp: string;
}

export default function TopCompanyFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<TopCompanyPaymentData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [failureReason, setFailureReason] = useState<string>(
    'Payment was not completed',
  );

  useEffect(() => {
    // Check PayOS payment status from URL params
    const paymentId = searchParams?.get('paymentId');
    const status = searchParams?.get('status');
    const errorCode = searchParams?.get('errorCode');
    const errorMessage = searchParams?.get('errorMessage');

    console.log('Payment failure params:', {
      paymentId,
      status,
      errorCode,
      errorMessage,
    });

    // Retrieve payment data from localStorage
    const storedData = localStorage.getItem('topCompanyPayment');
    if (!storedData) {
      console.log('No payment data found in localStorage');
      setFailureReason('No payment data found. Please try again.');
      setIsLoading(false);
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setPaymentData(data);
      console.log('Payment data loaded:', data);

      // Determine failure reason
      if (status === 'cancel') {
        setFailureReason('Payment was cancelled by user');
      } else if (errorCode) {
        setFailureReason(
          `Payment failed: ${errorMessage || `Error code: ${errorCode}`}`,
        );
      } else if (status === 'failed') {
        setFailureReason('Payment processing failed');
      } else {
        setFailureReason('Payment was not completed');
      }
    } catch (error) {
      console.error('Failed to parse payment data:', error);
      setFailureReason('Invalid payment data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    if (paymentData) {
      // Redirect back to company profile to retry
      router.push('/co/profile');
    } else {
      // If no payment data, go to profile
      router.push('/co/profile');
    }
  };

  const handleGoToProfile = () => {
    router.push('/co/profile');
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
              Payment Not Completed
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
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentData ? (
                  <>
                    {/* Package Info */}
                    <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 p-2">
                          <Crown className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {paymentData.packageType === 'custom'
                              ? 'Custom VIP Package'
                              : `${paymentData.packageType} Days VIP Package`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {paymentData.isExtension
                              ? 'Extension Period'
                              : 'New VIP Period'}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-orange-300 bg-orange-50 text-orange-700"
                      >
                        {paymentData.durationDays} days
                      </Badge>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="text-center">
                        <div className="mb-1 text-2xl font-bold text-red-900">
                          {formatVND(paymentData.amountVnd)}
                        </div>
                        <div className="text-sm text-red-700">
                          Total payment amount
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="rounded-lg bg-white/60 p-4">
                      <h4 className="mb-3 font-semibold text-gray-900">
                        VIP Features Included:
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                          <span>Top priority position #1</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                          <span>Featured in top companies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                          <span>Enhanced search visibility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                          <span>Premium company badge</span>
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
                    onClick={handleRetryPayment}
                    className="h-12 w-full bg-gradient-to-r from-orange-500 to-amber-600 font-semibold text-white shadow-xl hover:from-orange-600 hover:to-amber-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>

                  {/* Go to Profile */}
                  <Button
                    onClick={handleGoToProfile}
                    variant="outline"
                    className="h-12 w-full border-red-300 font-semibold text-red-700 hover:bg-red-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
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
                <AlertTriangle className="h-4 w-4 text-orange-500" />
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
