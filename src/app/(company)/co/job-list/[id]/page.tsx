import { redirect } from 'next/navigation';

export default function JobPage() {
  // Redirect to applicants tab by default
  redirect(`/job-list/1/applicants`);
}
