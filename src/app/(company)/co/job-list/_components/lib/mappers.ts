import { Job } from '@/types/Job';
import { JobDetails } from '../types/job';
import { formatSalaryRange } from '@/utils/formatters';

export function mapJobToJobDetails(job: Job): JobDetails {
  // Helper function to parse description into sections
  const parseDescription = (description: string) => {
    const lines = description.split('\n').filter((line) => line.trim());
    return lines.length > 0 ? lines : ['No detailed description available'];
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Not specified';
    }
  };

  return {
    id: job.id || '',
    title: job.title || 'Untitled Position',
    description: job.description || 'No description available',
    // For now, we'll split the description into sections
    // In a real app, you'd want separate fields in the API
    responsibilities: parseDescription(job.description || ''),
    requirements: job.skills?.map((skill) => skill.name) || [
      'No specific requirements listed',
    ],
    niceToHaves: job.benefit || ['Additional benefits to be discussed'],
    applicationsCount: job.applicants || 0,
    capacity: 50, // This should come from the API in a real implementation
    applyBefore: formatDate(job.deadline),
    postedOn: formatDate(job.createdAt),
    type: job.typeOfEmployment || 'Not specified',
    experienceYears: job.experienceYears || 0,
    salary:
      job.salaryMin && job.salaryMax
        ? formatSalaryRange(job.salaryMin, job.salaryMax)
        : 'Salary to be discussed',
    status: job.status || 'Not specified',
    categories: [job.category?.name || 'Uncategorized'],
    requiredSkills: job.skills?.map((skill) => skill.name) || [
      'Skills to be discussed',
    ],
  };
}
