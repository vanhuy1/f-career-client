'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { jobService } from '@/services/api/jobs/job-api';
import { Job } from '@/types/Job';
// import { formatSalaryRange } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch top jobs from new API
        const response = await jobService.getTopJobs();
        console.log(response.data);
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching top jobs:', err);
        setError('Failed to load top jobs');
        // Fallback to empty array
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopJobs();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Top<span className="text-[#3B82F6]"> Jobs</span>
            </h2>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Top<span className="text-[#3B82F6]"> Jobs</span>
            </h2>
          </div>
          <div className="py-8 text-center">
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Top<span className="text-[#3B82F6]"> Jobs</span>
          </h2>
          <Link
            href="/job"
            className="flex items-center text-sm text-[#3B82F6] hover:text-blue-700 md:text-base"
          >
            Show all jobs <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No top jobs available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  // Convert employment type from FULL_TIME to Full Time format
  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERNSHIP':
        return 'Internship';
      default:
        return type?.replace('_', ' ') || 'Full Time';
    }
  };

  const employmentTypeText = getEmploymentTypeText(job.typeOfEmployment);

  // Strip HTML tags from description and limit length
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const cleanDescription = stripHtml(job.description);
  const truncatedDescription =
    cleanDescription.length > 120
      ? `${cleanDescription.substring(0, 120)}...`
      : cleanDescription;

  // Format location to be shorter
  const formatLocation = (location: string) => {
    if (!location) return 'Remote';

    // Split by comma and take first 2 parts
    const parts = location.split(',').map((part) => part.trim());
    if (parts.length <= 2) return location;

    // Take city and country/region
    const city = parts[0];
    const country = parts[parts.length - 1];
    return `${city}, ${country}`;
  };

  // Get tags to display
  const getTags = () => {
    const tags = [];

    // Add category if available
    if (job.category && job.category.name) {
      tags.push(job.category.name);
    }

    // Add skills if available (take first 2 skills)
    if (job.skills && job.skills.length > 0) {
      const skillNames = job.skills.slice(0, 2).map((skill) => skill.name);
      tags.push(...skillNames);
    }

    return tags;
  };

  const tags = getTags();

  return (
    <Link href={`/job/${job.id}`} className="block">
      <div className="flex h-full cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-300">
            <Image
              src={job.company.logoUrl || '/placeholder.svg'}
              alt={`${job.company.companyName} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="rounded border border-blue-400 px-2 py-1 text-xs text-blue-600">
            {employmentTypeText}
          </span>
        </div>

        <h3 className="mb-1 overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap text-gray-900">
          {job.title}
        </h3>
        <div className="mb-2 overflow-hidden text-sm text-ellipsis whitespace-nowrap text-gray-600">
          {job.company.companyName} · {formatLocation(job.location)}
        </div>

        <p
          className="mb-4 flex-grow overflow-hidden text-sm text-gray-600"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {truncatedDescription}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600"
            >
              {tag}
            </span>
          ))}
          {job.experienceYears > 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600">
              {job.experienceYears}+ years
            </span>
          )}
          {job.salaryMin && job.salaryMax && (
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-600">
              ${job.salaryMin.toLocaleString()} - $
              {job.salaryMax.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function JobCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-20 rounded" />
      </div>
      <Skeleton className="mb-1 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mb-4 h-16 w-full" />
      <div className="mt-auto flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
