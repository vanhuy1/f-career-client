'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, Star, Building, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import { payosService } from '@/services/api/payment/payos-api';
import { jobService } from '@/services/api/jobs/job-api';
import { Button } from '@/components/ui/button';

export default function TopJobPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );

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

          const topJobData = JSON.parse(savedData);
          console.log('Parsed top job data:', topJobData);

          // Update job with new topJob value
          await jobService.update(topJobData.jobId, {
            topJob: topJobData.newTopJob,
          });

          console.log('Top job updated successfully!');

          setStatus('success');
          toast.success(
            `Job successfully added to top position ${topJobData.newTopJob}!`,
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
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Processing Payment...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we verify your payment and update your job
            position.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            {/* Success Title */}
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Payment Successful!
            </h1>

            {/* Success Message */}
            <p className="mb-6 text-gray-600">
              Your job has been successfully added to the top positions. It will
              now appear on the homepage!
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/co/job-list')}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <Building className="mr-2 h-4 w-4" />
                Manage Company Jobs
              </Button>

              <Button
                onClick={() => router.push('/job')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
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
        </div>
      </div>
    );
  }

  return null;
}
