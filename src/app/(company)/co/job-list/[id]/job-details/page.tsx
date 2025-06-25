import { JobDetailsView } from '../../_components/job-details-view';
import { getJobDetails } from '../../_components/lib/data';

export default async function JobDetailsPage() {
  const jobDetails = await getJobDetails();

  return <JobDetailsView job={jobDetails} />;
}
