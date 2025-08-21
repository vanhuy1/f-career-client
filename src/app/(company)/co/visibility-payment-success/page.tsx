'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { payosService } from '@/services/api/payment/payos-api';
import { jobService } from '@/services/api/jobs/job-api';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/Job';

export default function VisibilityPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );

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

        const data = JSON.parse(saved) as {
          jobId: string;
          packageType: 'vip' | 'premium';
          durationDays: number;
          priorityPosition: number;
          vipExpired: string;
        };

        await jobService.update(data.jobId, {
          priorityPosition: data.priorityPosition,
          vipExpired: data.vipExpired,
        } as Job);

        setStatus('success');
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
  }, [router, searchParams]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Processing Payment...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we verify your payment and apply your package.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="mb-6 text-gray-600">
            Your job visibility package has been applied.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/co/job-list')}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Manage Company Jobs
            </Button>
            <Button
              onClick={() => router.push('/job')}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              View Public Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
