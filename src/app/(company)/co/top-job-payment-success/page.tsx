'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Loader2,
  Star,
  Building,
  Briefcase,
  CreditCard,
  Calendar,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { payosService } from '@/services/api/payment/payos-api';
import { jobService } from '@/services/api/jobs/job-api';
import { paymentHistoryService } from '@/services/api/payment/payment-history-api';
import { useUserData } from '@/services/state/userSlice';

interface TopJobData {
  jobId: string;
  newTopJob: number;
  topJobExpired: string;
  amount?: number;
  durationDays?: number;
  coupon?: {
    id: number;
    code: string;
    discountPercentage: number;
  } | null;
}

export default function TopJobPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userData = useUserData();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );
  const [topJobData, setTopJobData] = useState<TopJobData | null>(null);
  const [hasProcessedPayment, setHasProcessedPayment] = useState(false);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      const orderCode =
        searchParams?.get('orderCode') || searchParams?.get('id');
      const payosStatus = searchParams?.get('status');
      const cancel = searchParams?.get('cancel');

      console.log('Top Job Payment Success Debug:', {
        orderCode,
        payosStatus,
        cancel,
        allParams: Object.fromEntries(searchParams?.entries() || []),
      });

      if (!orderCode) {
        setStatus('error');
        toast.error('Invalid payment information');
        router.push('/co/top-job-payment-failed');
        return;
      }

      try {
        // Verify payment status with PayOS
        console.log(
          'Calling PayOS getPaymentStatus with orderCode:',
          orderCode,
        );
        const paymentStatus = await payosService.getPaymentStatus(orderCode);
        console.log('PayOS payment status response:', paymentStatus);

        const isPaymentSuccessful =
          (paymentStatus.status === 'COMPLETED' || payosStatus === 'PAID') &&
          cancel === 'false';

        if (isPaymentSuccessful) {
          // Get saved top job data from localStorage
          const savedData = localStorage.getItem('TOP_JOB_DATA');
          console.log('Saved top job data from localStorage:', savedData);

          if (!savedData) {
            setStatus('error');
            toast.error('Top job data not found. Please try again.');
            router.push('/co/top-job-payment-failed');
            return;
          }

          const parsedTopJobData = JSON.parse(savedData);
          console.log('Parsed top job data:', parsedTopJobData);

          // Prevent duplicate processing
          if (hasProcessedPayment) {
            console.log('Payment already processed, skipping...');
            setTopJobData(parsedTopJobData);
            setStatus('success');
            setIsProcessing(false);
            return;
          }

          // Update job with new topJob value and expiry
          await jobService.update(parsedTopJobData.jobId, {
            topJob: parsedTopJobData.newTopJob,
            topJobExpired: parsedTopJobData.topJobExpired,
          });

          console.log('Top job updated successfully!');

          // Create payment record in database
          try {
            await paymentHistoryService.createPayment({
              userId: Number(userData?.id) || 0,
              packageType: 2, // TOP_JOB = 2
              couponId: parsedTopJobData.coupon?.id
                ? Number(parsedTopJobData.coupon.id)
                : undefined,
              amount: parsedTopJobData.amount || 0,
              paymentMethod: 'PAYOS',
              status: 'SUCCESS',
              transactionId: orderCode || undefined,
            });
            console.log('Top job payment record created successfully');
          } catch (error) {
            console.error('Failed to create payment record:', error);
          }

          setTopJobData(parsedTopJobData);
          setStatus('success');
          setHasProcessedPayment(true);
          toast.success(
            `Job successfully added to top position ${parsedTopJobData.newTopJob}!`,
          );

          // Clear top job data only after successful display
          setTimeout(() => {
            localStorage.removeItem('TOP_JOB_DATA');
          }, 1000);
        } else {
          setStatus('error');
          toast.error('Payment was not completed. Please try again.');
          router.push('/co/top-job-payment-failed');
        }
      } catch (error) {
        console.error('Error processing top job payment success:', error);
        setStatus('error');
        toast.error('Failed to verify payment status');
        router.push('/co/top-job-payment-failed');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, router, hasProcessedPayment, userData]);

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
                Please wait while we verify your payment and update your job
                position.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success' && topJobData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-green-900">
              Top Job Payment Successful!
            </h1>
            <p className="text-lg text-green-700">
              Your job has been successfully added to the top positions and will
              now appear on the homepage!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Payment Summary */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <CreditCard className="h-5 w-5" />
                    Payment Successful
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Package Details */}
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

                  {/* Duration & Expiry & Amount */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Featured Until
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {format(
                          new Date(topJobData.topJobExpired),
                          'MMM dd, yyyy',
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Priority Level
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        Landing page
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
                        {topJobData.amount?.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="border-t border-green-200/50 pt-4">
                    <h4 className="mb-3 font-semibold text-green-900">
                      What you get:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Featured on homepage spotlight
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Higher visibility to candidates
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Priority position in search results
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Enhanced job listing appearance
                      </div>
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
                      Job Featured Successfully!
                    </h3>
                    <p className="mb-6 text-sm text-gray-600">
                      Your job is now prominently displayed on the homepage
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
                        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        View Public Jobs
                      </Button>

                      <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Star className="mr-2 h-4 w-4" />
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
