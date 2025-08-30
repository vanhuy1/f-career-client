'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Loader2,
  Eye,
  Building,
  Briefcase,
  CreditCard,
  Calendar,
  XCircle,
  Star,
  Crown,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { payosService } from '@/services/api/payment/payos-api';
import { jobService } from '@/services/api/jobs/job-api';
import { Job } from '@/types/Job';
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

export default function VisibilityPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userData = useUserData();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );
  const [packageData, setPackageData] = useState<VisibilityPackageData | null>(
    null,
  );
  const [hasProcessedPayment, setHasProcessedPayment] = useState(false);

  useEffect(() => {
    const process = async () => {
      const orderCode =
        searchParams?.get('orderCode') || searchParams?.get('id');
      const payosStatus = searchParams?.get('status');
      const cancel = searchParams?.get('cancel');

      if (!orderCode) {
        setStatus('error');
        toast.error('Invalid payment information');
        router.push('/co/top-job-payment-failed');
        return;
      }

      try {
        const paymentStatus = await payosService.getPaymentStatus(orderCode);
        const ok =
          (paymentStatus.status === 'COMPLETED' || payosStatus === 'PAID') &&
          cancel === 'false';
        if (!ok) {
          setStatus('error');
          toast.error('Payment was not completed. Please try again.');
          router.push('/co/top-job-payment-failed');
          return;
        }

        const saved = localStorage.getItem('VISIBILITY_PACKAGE_DATA');
        if (!saved) {
          setStatus('error');
          toast.error('Package data not found. Please try again.');
          router.push('/co/top-job-payment-failed');
          return;
        }

        const data = JSON.parse(saved) as VisibilityPackageData;

        // Prevent duplicate processing
        if (hasProcessedPayment) {
          console.log('Payment already processed, skipping...');
          setPackageData(data);
          setStatus('success');
          setIsProcessing(false);
          return;
        }

        await jobService.update(data.jobId, {
          priorityPosition: data.priorityPosition,
          vipExpired: data.vipExpired,
        } as Job);

        // Create payment record in database
        try {
          const packageType = data.packageType === 'vip' ? 3 : 4; // VIP_JOB = 3, PREMIUM_JOB = 4
          await paymentHistoryService.createPayment({
            userId: Number(userData?.id) || 0,
            packageType: packageType,
            couponId: data.coupon?.id ? Number(data.coupon.id) : undefined,
            amount: data.amount || 0,
            paymentMethod: 'PAYOS',
            status: 'SUCCESS',
            transactionId: orderCode || undefined,
          });
          console.log('Visibility payment record created successfully');
        } catch (error) {
          console.error('Failed to create payment record:', error);
        }

        setPackageData(data);
        setStatus('success');
        setHasProcessedPayment(true);
        toast.success('Visibility package applied successfully!');
        setTimeout(
          () => localStorage.removeItem('VISIBILITY_PACKAGE_DATA'),
          800,
        );
      } catch (e) {
        console.error(e);
        setStatus('error');
        toast.error('Failed to verify payment status');
        router.push('/co/top-job-payment-failed');
      } finally {
        setIsProcessing(false);
      }
    };

    process();
  }, [router, searchParams, hasProcessedPayment, userData]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold text-blue-900">
                Processing Payment...
              </h2>
              <p className="mt-2 text-blue-700">
                Please wait while we verify your payment and apply your
                visibility package.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success' && packageData) {
    const isVIP = packageData.packageType === 'vip';
    const packageColor = isVIP ? 'purple' : 'blue';
    const packageTitle = isVIP
      ? 'VIP Visibility Package'
      : 'Premium Visibility Package';
    const packageDescription = isVIP
      ? 'Maximum visibility and priority'
      : 'Enhanced visibility and features';

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-green-900">
              Visibility Package Applied!
            </h1>
            <p className="text-lg text-green-700">
              Your job visibility has been enhanced successfully!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Package Summary */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <CreditCard className="h-5 w-5" />
                    Package Applied Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Package Details */}
                  <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg bg-gradient-to-br from-${packageColor}-100 to-${packageColor === 'purple' ? 'pink' : 'cyan'}-100 p-2`}
                      >
                        {isVIP ? (
                          <Crown className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Star className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {packageTitle}
                        </div>
                        <div className="text-sm text-gray-600">
                          {packageDescription}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        isVIP
                          ? 'border-purple-300 bg-purple-50 text-purple-700'
                          : 'border-blue-300 bg-blue-50 text-blue-700'
                      }
                    >
                      {isVIP ? 'VIP' : 'Premium'}
                    </Badge>
                  </div>

                  {/* Duration & Expiry & Amount */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Active Until
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {format(
                          new Date(packageData.vipExpired),
                          'MMM dd, yyyy',
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Priority Level
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        #{packageData.priorityPosition}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Amount Paid
                        </span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {packageData.amount?.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="border-t border-green-200/50 pt-4">
                    <h4 className="mb-3 font-semibold text-green-900">
                      Package Benefits:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? 'Maximum priority in search results'
                          : 'Enhanced search visibility'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? 'VIP badge and special highlighting'
                          : 'Premium badge and enhanced appearance'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? 'Top position in job listings'
                          : 'Improved ranking in job listings'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? '24/7 priority support'
                          : 'Enhanced customer support'}
                      </div>
                      {isVIP && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Featured on homepage spotlight
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Section */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-green-200 bg-white shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-green-900">Success!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="py-4 text-center">
                    <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                    <h3 className="mb-2 text-lg font-semibold text-green-900">
                      Package Applied Successfully!
                    </h3>
                    <p className="mb-6 text-sm text-gray-600">
                      Your job now has enhanced visibility and will reach more
                      candidates
                    </p>

                    <div className="space-y-3">
                      <Button
                        onClick={() => router.push('/co/job-list')}
                        className="w-full bg-green-600 text-white hover:bg-green-700"
                      >
                        <Building className="mr-2 h-4 w-4" />
                        Manage Company Jobs
                      </Button>

                      <Button
                        onClick={() => router.push('/job')}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        View Public Jobs
                      </Button>

                      <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Go to Homepage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-red-900">
                Payment Processing Failed
              </h2>
              <p className="mt-2 text-red-700">
                There was an issue processing your payment. Please try again.
              </p>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => router.push('/co/job-list')}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  Return to Job List
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  Go to Homepage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
