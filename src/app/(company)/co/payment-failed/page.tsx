'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Plus,
  Briefcase,
  Building,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';

export default function PaymentFailedPage() {
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
  }, [searchParams]);

  const handleRetryJob = () => {
    router.push('/co/post-job');
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
          <p className="mb-6 text-gray-600">{errorMessage}</p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRetryJob}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
            </Button>

            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Contact Support
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
              onClick={handleGoToCompanyJobs}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Building className="mr-2 h-4 w-4" />
              Manage Company Jobs
            </Button>
          </div>

          {/* Back to Post Job */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <Button
              onClick={() => router.push('/co/post-job')}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Post Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
