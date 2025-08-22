'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  CheckCircle,
  Calendar,
  CreditCard,
  Loader2,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { companyService } from '@/services/api/company/company-api';
import { Coupon } from '@/services/api/coupons/coupon-api';

interface TopCompanyPaymentData {
  amountVnd: number;
  baseAmount: number;
  coupon: Coupon | null;
  companyId: string;
  durationDays: number;
  priorityPosition: number;
  vipExpired: string;
  isExtension: boolean;
  packageType: string;
  basePricePerDay: number;
  timestamp: string;
}

export default function TopCompanySuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<TopCompanyPaymentData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    'success' | 'failed' | 'pending'
  >('pending');
  const [isUpdatingVIP, setIsUpdatingVIP] = useState(false);
  const [vipUpdateStatus, setVipUpdateStatus] = useState<
    'pending' | 'success' | 'failed'
  >('pending');
  const [hasProcessedPayment, setHasProcessedPayment] = useState(false);

  const handlePaymentSuccess = useCallback(
    async (data: TopCompanyPaymentData) => {
      setIsUpdatingVIP(true);
      setVipUpdateStatus('pending');
      try {
        // Call backend API to update company VIP status
        await companyService.updateVIPStatus(data.companyId, {
          priorityPosition: data.priorityPosition,
          vipExpired: data.vipExpired,
        });

        setVipUpdateStatus('success');
        toast.success(
          data.isExtension
            ? 'VIP status extended successfully!'
            : 'Company upgraded to VIP successfully!',
        );

        // Clear payment data from storage
        localStorage.removeItem('topCompanyPayment');
      } catch (error) {
        console.error('Failed to update company VIP status:', error);
        setVipUpdateStatus('failed');
        toast.error(
          'Payment successful but failed to update company status. Please contact support.',
        );
        // Don't clear localStorage if API call failed
      } finally {
        setIsUpdatingVIP(false);
      }
    },
    [],
  );

  useEffect(() => {
    // Check PayOS payment status from URL params
    const paymentId = searchParams?.get('paymentId');
    const status = searchParams?.get('status');

    console.log('Payment return params:', { paymentId, status });

    // Retrieve payment data from localStorage
    const storedData = localStorage.getItem('topCompanyPayment');
    if (!storedData) {
      toast.error('No payment data found. Please try again.');
      router.push('/co/profile');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setPaymentData(data);
      console.log('Payment data loaded:', data);

      // Prevent duplicate processing
      if (hasProcessedPayment) {
        console.log('Payment already processed, skipping...');
        setIsLoading(false);
        return;
      }

      // Determine payment status
      if (status === 'success' && paymentId) {
        console.log('Payment confirmed successful with ID:', paymentId);
        setPaymentStatus('success');
        setHasProcessedPayment(true);
        // Automatically start VIP status update
        handlePaymentSuccess(data);
      } else if (status === 'cancel') {
        console.log('Payment was cancelled');
        setPaymentStatus('failed');
        setHasProcessedPayment(true);
        toast.error('Payment was cancelled');
      } else {
        // If no status params, assume payment was successful (PayOS return case)
        // This handles the case when PayOS redirects back without query params
        console.log('No status params, assuming payment successful');
        setPaymentStatus('success');
        setHasProcessedPayment(true);
        handlePaymentSuccess(data);
      }
    } catch (error) {
      console.error('Failed to parse payment data:', error);
      toast.error('Invalid payment data. Please try again.');
      router.push('/co/profile');
    } finally {
      setIsLoading(false);
    }
  }, [router, searchParams, handlePaymentSuccess, hasProcessedPayment]);

  const handleRetryVIPUpdate = async () => {
    if (!paymentData) return;
    setHasProcessedPayment(false); // Reset flag to allow retry
    await handlePaymentSuccess(paymentData);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-8 w-8 text-red-600" />
          <p className="text-gray-600">Payment data not found</p>
          <Button onClick={() => router.push('/co/profile')} className="mt-4">
            Return to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            {paymentStatus === 'success' ? (
              <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : paymentStatus === 'failed' ? (
              <div className="rounded-full bg-gradient-to-br from-red-100 to-pink-100 p-3">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            ) : (
              <div className="rounded-full bg-gradient-to-br from-orange-100 to-amber-100 p-3">
                <Crown className="h-8 w-8 text-orange-600" />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {paymentStatus === 'success'
                ? vipUpdateStatus === 'success'
                  ? paymentData.isExtension
                    ? 'VIP Extended Successfully!'
                    : 'VIP Upgrade Successful!'
                  : vipUpdateStatus === 'failed'
                    ? 'VIP Update Failed'
                    : 'Payment Successful!'
                : paymentStatus === 'failed'
                  ? 'Payment Failed'
                  : paymentData.isExtension
                    ? 'Extend VIP Status'
                    : 'Upgrade to VIP'}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {paymentStatus === 'success'
              ? vipUpdateStatus === 'success'
                ? 'Your company VIP status has been updated successfully!'
                : vipUpdateStatus === 'failed'
                  ? 'Payment was successful but VIP status update failed. Please try again.'
                  : 'Payment successful! Now updating your company VIP status...'
              : paymentStatus === 'failed'
                ? 'Payment was not completed. Please try again.'
                : 'Complete your payment to activate VIP features'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Payment Summary */}
          <div className="lg:col-span-2">
            <Card
              className={`border-2 shadow-xl ${
                paymentStatus === 'success'
                  ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                  : paymentStatus === 'failed'
                    ? 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'
                    : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'
              }`}
            >
              <CardHeader className="pb-4">
                <CardTitle
                  className={`flex items-center gap-2 ${
                    paymentStatus === 'success'
                      ? 'text-green-900'
                      : paymentStatus === 'failed'
                        ? 'text-red-900'
                        : 'text-orange-900'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  {paymentStatus === 'success'
                    ? 'Payment Successful'
                    : paymentStatus === 'failed'
                      ? 'Payment Failed'
                      : 'Payment Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Package Details */}
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

                {/* Duration & Expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white/60 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Duration
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {paymentData.durationDays} days
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/60 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Expires
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {format(new Date(paymentData.vipExpired), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-orange-200/50 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span>{paymentData.durationDays} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Base price:</span>
                      <span>{formatVND(paymentData.baseAmount)}</span>
                    </div>
                    {paymentData.coupon && (
                      <div className="flex justify-between text-sm">
                        <span>Coupon discount:</span>
                        <span className="text-green-600">
                          -{paymentData.coupon.discountPercentage}%
                        </span>
                      </div>
                    )}
                    <div className="border-t border-orange-200/50 pt-2">
                      <div className="flex justify-between text-lg font-bold text-orange-900">
                        <span>Total Amount:</span>
                        <span>{formatVND(paymentData.amountVnd)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Section */}
          <div className="lg:col-span-1">
            <Card
              className={`border-2 bg-white shadow-xl ${
                paymentStatus === 'success'
                  ? 'border-green-200'
                  : paymentStatus === 'failed'
                    ? 'border-red-200'
                    : 'border-orange-200'
              }`}
            >
              <CardHeader className="pb-4">
                <CardTitle
                  className={
                    paymentStatus === 'success'
                      ? 'text-green-900'
                      : paymentStatus === 'failed'
                        ? 'text-red-900'
                        : 'text-orange-900'
                  }
                >
                  {paymentStatus === 'success'
                    ? 'Success!'
                    : paymentStatus === 'failed'
                      ? 'Payment Failed'
                      : 'Complete Payment'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentStatus === 'success' ? (
                  <div className="py-8 text-center">
                    {isUpdatingVIP ? (
                      <>
                        <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-blue-500" />
                        <h3 className="mb-2 text-lg font-semibold text-blue-900">
                          Updating VIP Status...
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                          Please wait while we update your company&apos;s VIP
                          privileges
                        </p>
                      </>
                    ) : vipUpdateStatus === 'success' ? (
                      <>
                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                        <h3 className="mb-2 text-lg font-semibold text-green-900">
                          VIP Status Updated!
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                          Your company now has VIP privileges
                        </p>
                        <Button
                          onClick={() => router.push('/co/profile')}
                          className="w-full bg-green-600 text-white hover:bg-green-700"
                        >
                          Return to Profile
                        </Button>
                      </>
                    ) : vipUpdateStatus === 'failed' ? (
                      <>
                        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                        <h3 className="mb-2 text-lg font-semibold text-red-900">
                          VIP Update Failed
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                          Payment was successful but VIP status update failed.
                          Please try again.
                        </p>
                        <div className="space-y-2">
                          <Button
                            onClick={handleRetryVIPUpdate}
                            disabled={isUpdatingVIP}
                            className="w-full bg-red-600 text-white hover:bg-red-700"
                          >
                            {isUpdatingVIP ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Retrying...
                              </>
                            ) : (
                              'Retry VIP Update'
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => router.push('/co/profile')}
                            className="w-full border-red-300 text-red-700 hover:bg-red-50"
                          >
                            Return to Profile
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                        <h3 className="mb-2 text-lg font-semibold text-green-900">
                          Payment Successful!
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                          Now updating your company&apos;s VIP status...
                        </p>
                      </>
                    )}
                  </div>
                ) : paymentStatus === 'failed' ? (
                  <div className="py-8 text-center">
                    <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                    <h3 className="mb-2 text-lg font-semibold text-red-900">
                      Payment Not Completed
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Please try again or contact support
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => router.push('/co/profile')}
                        className="w-full bg-red-600 text-white hover:bg-red-700"
                      >
                        Return to Profile
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/co/profile')}
                        className="w-full border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-orange-600" />
                    <p className="text-sm text-gray-600">
                      Processing payment...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features List - Only show on success */}
        {paymentStatus === 'success' && (
          <Card className="mt-8 border-green-200 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-green-900">
                VIP Features Activated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <Crown className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    Top priority position #1
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <Crown className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    Featured in top companies
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <Crown className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    Enhanced search visibility
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <Crown className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    Premium company badge
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
