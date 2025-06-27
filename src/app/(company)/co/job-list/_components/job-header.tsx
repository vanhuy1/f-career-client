'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jobService } from '@/services/api/jobs/job-api';
import { toast } from 'react-toastify';

export function JobHeader() {
  const router = useRouter();
  const params = useParams() || {};
  const jobId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  const [jobData, setJobData] = useState<{
    title: string;
    category: { name: string };
    typeOfEmployment: string;
    applicants: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      try {
        setIsLoading(true);
        const response = await jobService.findOne(jobId);
        setJobData(response);
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/co/job-list')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          {isLoading ? (
            <div className="h-12 w-48 animate-pulse rounded bg-gray-200"></div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                {jobData?.title || 'Job Details'}
              </h1>
              <p className="text-gray-600">
                {jobData?.category?.name || 'N/A'} •{' '}
                {jobData?.typeOfEmployment || 'N/A'} •{jobData?.applicants || 0}{' '}
                Applications
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
