'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, Plus, Briefcase, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { payosService } from '@/services/api/payment/payos-api';
import { jobService } from '@/services/api/jobs/job-api';
import { useUser } from '@/services/state/userSlice';
import { JobStatus } from '@/types/Job';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );
  const user = useUser();

  useEffect(() => {
    const processPaymentSuccess = async () => {
      // PayOS có thể trả về orderCode hoặc id
      const orderCode =
        searchParams?.get('orderCode') || searchParams?.get('id');
      const payosStatus = searchParams?.get('status');
      const cancel = searchParams?.get('cancel');

      console.log('Payment Success Debug:', {
        orderCode,
        payosStatus,
        cancel,
        allParams: Object.fromEntries(searchParams?.entries() || []),
      });

      if (!orderCode) {
        setStatus('error');
        toast.error('Invalid payment information');
        router.push('/co/payment-failed');
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

        // Check if payment was successful
        console.log('Payment verification conditions:', {
          payosStatus: paymentStatus.status,
          queryStatus: payosStatus,
          cancel,
          isCompleted: paymentStatus.status === 'COMPLETED',
          isPaid: payosStatus === 'PAID',
          isNotCancelled: cancel === 'false',
        });

        // PayOS có thể trả về status khác nhau trong API và query params
        // API status: 'COMPLETED', Query status: 'PAID'
        const isPaymentSuccessful =
          (paymentStatus.status === 'COMPLETED' || payosStatus === 'PAID') &&
          cancel === 'false';

        if (isPaymentSuccessful) {
          // Get saved form data from localStorage
          const savedData = localStorage.getItem('JOB_FORM_DATA');
          console.log('Saved form data from localStorage:', savedData);

          if (!savedData) {
            setStatus('error');
            toast.error(
              'Form data not found. Please try posting the job again.',
            );
            router.push('/co/payment-failed');
            return;
          }

          const formData = JSON.parse(savedData);
          console.log('Parsed form data:', formData);

          // Create job with saved data
          const jobData = {
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId || '1',
            companyId: String(user?.data?.companyId || '1'),
            skillIds: formData.skillIds || [],
            benefit: (formData.benefits || []).map(
              (benefit: { description: string }) => benefit.description,
            ),
            location: formData.location,
            salaryMin: (formData.salaryRange || [5000, 22000])[0],
            salaryMax: (formData.salaryRange || [5000, 22000])[1],
            experienceYears: formData.experienceYears || 0,
            isVip: formData.isVip || false,
            packageInfo: formData.packageInfo,
            deadline: formData.deadline,
            typeOfEmployment: formData.typeOfEmployment || 'FULL_TIME',
            status: 'ACTIVE' as JobStatus,
            priorityPosition: formData.priorityPosition || 3,
            vip_expiration: formData.vip_expiration,
          };

          console.log('Creating job with data:', jobData);
          await jobService.create(jobData);
          console.log('Job created successfully!');

          // Save package info to localStorage
          if (user?.data?.companyId) {
            localStorage.setItem(
              `company_${user.data.companyId}_package`,
              JSON.stringify(formData.packageInfo),
            );
          }

          setStatus('success');
          toast.success('Payment successful and job posted!');

          // Clear form data only after successful display
          setTimeout(() => {
            localStorage.removeItem('JOB_FORM_DATA');
          }, 1000);
        } else {
          setStatus('error');
          toast.error('Payment was not completed. Please try again.');
          router.push('/co/payment-failed');
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
        setStatus('error');
        toast.error('Failed to verify payment status');
        router.push('/co/payment-failed');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, router, user]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Processing Payment...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we verify your payment and create your job
            posting.
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
              Your job has been posted successfully. What would you like to do
              next?
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/co/post-job')}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Post Another Job
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
                onClick={() => router.push('/co/job-list')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Building className="mr-2 h-4 w-4" />
                Manage Company Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl text-red-600">!</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Payment Error
          </h2>
          <p className="mt-2 text-gray-600">
            There was an issue with your payment. Please try again.
          </p>
          <button
            onClick={() => router.push('/co/post-job')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Post Job
          </button>
        </div>
      </div>
    );
  }

  return null;
}
