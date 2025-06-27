'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApplicantsView } from '../../_components/applicants-view';
import { applicationService } from '@/services/api/applications/application-api';
import { ApplicationByJobId } from '@/types/Applicants';
import { Candidate } from '../../_components/types/candidate';
import { toast } from 'react-toastify';
import { ApplicationStatus } from '@/enums/applicationStatus';

export default function ApplicantsPage() {
  const params = useParams() || {};
  const jobId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;
  const [applicants, setApplicants] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) return;

      try {
        setIsLoading(true);
        const response = await applicationService.getApplicationByJobId({
          jobId: jobId as string,
          offset: 0,
          limit: 100, // Fetch up to 100 applicants
        });

        // Transform the API response to match the Candidate type expected by ApplicantsView
        if (response && response.applications) {
          const transformedApplicants = response.applications.map(
            (app: ApplicationByJobId) => ({
              id: app.id,
              name: app.applicantName,
              // Map status string to ApplicationStatus enum value, defaulting to APPLIED if not recognized
              status: Object.values(ApplicationStatus).includes(
                app.applicationStatus as ApplicationStatus,
              )
                ? (app.applicationStatus as ApplicationStatus)
                : ApplicationStatus.APPLIED,
              appliedDate: app.appliedDate,
              avatar: '', // API doesn't provide avatar, use empty string or default
              score: 0, // If score is not provided, use a default value
            }),
          );

          setApplicants(transformedApplicants);
        } else {
          setApplicants([]);
        }
      } catch (error) {
        toast.error('Failed to fetch applicants for this job');
        console.error('Error fetching applicants:', error);
        setApplicants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        Loading applicants...
      </div>
    );
  }

  return <ApplicantsView applicants={applicants} />;
}
