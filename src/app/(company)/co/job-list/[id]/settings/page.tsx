'use client';

import { useParams } from 'next/navigation';
import { JobSettingsView } from '../../_components/job-settings-view';
import { useJobDetail } from '@/hooks/use-job-detail';

export default function SettingsPage() {
  const params = useParams() || {};
  const jobId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  // Fetch job data for header
  useJobDetail(jobId);

  return <JobSettingsView />;
}
