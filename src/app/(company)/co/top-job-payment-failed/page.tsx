'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  XCircle,
  AlertTriangle,
  Star,
  Building,
  Briefcase,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

export default function TopJobPaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState(
    'Payment was not completed successfully.',
  );

  useEffect(() => {
    const status = searchParams?.get('status');
    const cancel = searchParams?.get('cancel');

    if (cancel === 'true') {
      setErrorMessage('Payment was cancelled by user.');
    } else if (status === 'FAILED') {
      setErrorMessage('Payment failed due to technical issues.');
    } else {
      setErrorMessage('Payment was not completed successfully.');
    }

    // Don't clear localStorage immediately, let user retry if needed
    // localStorage.removeItem('TOP_JOB_DATA');
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

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
    toast.info('Contact support feature will be implemented soon.');
  };

  const handleGoToPublicJobs = () => {
    router.push('/job');
  };

  const handleGoToCompanyJobs = () => {
    router.push('/co/job-list');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>

          {/* Error Title */}
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Payment Failed
          </h1>

          {/* Error Message */}
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="text-red-800">
              <p className="font-medium">Payment Issue</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRetryTopJob}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <Star className="mr-2 h-4 w-4" />
              Try Top Job Again
            </Button>

            <Button
              onClick={handleGoToCompanyJobs}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Building className="mr-2 h-4 w-4" />
              Manage Company Jobs
            </Button>

            <Button
              onClick={handleGoToPublicJobs}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              View Public Jobs
            </Button>

            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
