import { ApplicantsView } from '../../_components/applicants-view';
import { getJobApplicants } from '../../_components/lib/data';

export default async function ApplicantsPage() {
  const applicants = await getJobApplicants();

  return <ApplicantsView applicants={applicants} />;
}
