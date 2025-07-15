'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApplicantsView } from '../../_components/applicants-view';
import { applicationService } from '@/services/api/applications/application-api';
import { ApplicationByJobId } from '@/types/Applicants';
import { Candidate } from '../../_components/types/candidate';
import { toast } from 'react-toastify';
import { ApplicationStatus } from '@/enums/applicationStatus';

const getScoreColor = (score: number) => {
  if (score === 100) return 'text-purple-600'; // Perfect score
  if (score >= 75) return 'text-green-600'; // 75-99: Excellent
  if (score >= 50) return 'text-blue-600'; // 50-74: Good
  if (score >= 25) return 'text-yellow-600'; // 25-49: Fair
  return 'text-red-600'; // 0-24: Poor
};

const getScoreBackgroundColor = (score: number) => {
  if (score === 100) return 'bg-purple-100'; // Perfect score
  if (score >= 75) return 'bg-green-100'; // 75-99: Excellent
  if (score >= 50) return 'bg-blue-100'; // 50-74: Good
  if (score >= 25) return 'bg-yellow-100'; // 25-49: Fair
  return 'bg-red-100'; // 0-24: Poor
};

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
            (app: ApplicationByJobId, index: number) => ({
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
              score: app.ai_score ?? 0, // Use AI score if available, otherwise default to 0
              // Mock data for testing filter functionality
              age: 22 + ((index * 7) % 40), // Generate ages between 22-62
              gender: (
                ['male', 'female', 'other', 'prefer_not_to_say'] as const
              )[index % 4],
            }),
          );

          // Sort applicants by score from highest to lowest
          const sortedApplicants = transformedApplicants.sort(
            (a, b) => b.score - a.score,
          );
          setApplicants(sortedApplicants);
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

  return (
    <ApplicantsView
      applicants={applicants}
      getScoreColor={getScoreColor}
      getScoreBackgroundColor={getScoreBackgroundColor}
    />
  );
}
