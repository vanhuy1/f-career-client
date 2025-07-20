import { Job } from '@/types/Job';
import JobDetails from '@/components/job-search/job-detail';
import JobCategories from '@/components/job-search/job-categories';
import JobSkills from '@/components/job-search/job-skill';
import { formatDate, formatSalaryRange } from '../utils/formatters';
import GenerateRoadmapButton from './GenerateRoadmapButton';

interface JobDetailSidebarProps {
  job: Job;
}

export default function JobDetailSidebar({ job }: JobDetailSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="space-y-8 rounded-lg border p-6">
        <JobDetails
          applied={0} // Cần thêm field này vào API
          capacity={1} // Cần thêm field này vào API
          applyBefore={formatDate(job.deadline)}
          postedOn={job.createdAt ? formatDate(job.createdAt) : ''}
          jobType={job.typeOfEmployment}
          salary={formatSalaryRange(job.salaryMin, job.salaryMax)}
        />
        <JobCategories categories={[job.category.name]} />
        <JobSkills skills={job.skills.map((skill) => skill.name)} />

        <div className="border-t pt-4">
          <GenerateRoadmapButton
            jobId={job.id?.toString() || ''}
            jobTitle={job.title}
          />
        </div>
      </div>
    </div>
  );
}
