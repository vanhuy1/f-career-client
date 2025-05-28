import { Job } from '@/types/Job';
import JobSection from '@/components/job-search/job-section';
import CheckListItem from '@/components/job-search/job-check-list-item';
import { Gift } from 'lucide-react';

interface JobDetailContentProps {
  job: Job;
}

export default function JobDetailContent({ job }: JobDetailContentProps) {
  return (
    <div className="space-y-10 lg:col-span-2">
      <JobSection title="Description">
        <p className="leading-relaxed text-gray-600">{job.description}</p>
      </JobSection>

      <JobSection title="Responsibilities">
        <ul className="space-y-3">
          {job.responsibility.map((item, index) => (
            <CheckListItem key={index}>{item}</CheckListItem>
          ))}
        </ul>
      </JobSection>

      <JobSection title="Who You Are">
        <ul className="space-y-3">
          {job.jobFitAttributes.map((item, index) => (
            <CheckListItem key={index}>{item}</CheckListItem>
          ))}
        </ul>
      </JobSection>

      <JobSection title="Nice-To-Haves">
        <ul className="space-y-3">
          {job.niceToHave.map((item, index) => (
            <CheckListItem key={index}>{item}</CheckListItem>
          ))}
        </ul>
      </JobSection>

      <JobSection title="Benefits & Perks">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {job.benefit.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-gray-100 p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50"
            >
              <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </JobSection>
    </div>
  );
}
