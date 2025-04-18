import { ChevronDown, Grid, List } from 'lucide-react';
import JobCard from '@/components/job-search/job-card';
import Pagination from '@/components/job-search/pagination';
import JobFilterSidebar from '@/components/job-search/filter-sidebar';

export default function JobListingsPage() {
  const jobData = [
    {
      title: 'Social Media Assistant',
      company: 'Nomad',
      location: 'Paris, France',
      logo: '/logo-landing/nomad.png',
      tags: ['Full-Time', 'Marketing', 'Design'],
      applied: 5,
      capacity: 10,
    },
    {
      title: 'Brand Designer',
      company: 'Dropbox',
      location: 'San Francisco, USA',
      logo: '/logo-landing/dropbox.png',
      tags: ['Full-Time', 'Marketing', 'Design'],
      applied: 2,
      capacity: 10,
    },
    {
      title: 'Interactive Developer',
      company: 'Terraform',
      location: 'Hamburg, Germany',
      logo: '/logo-landing/terraform.png',
      tags: ['Full-Time', 'Marketing', 'Design'],
      applied: 8,
      capacity: 12,
    },
    {
      title: 'Email Marketing',
      company: 'Revolut',
      location: 'Madrid, Spain',
      logo: '/logo-landing/revolut.jpg',
      tags: ['Full-Time', 'Marketing', 'Design'],
      applied: 0,
      capacity: 10,
    },
    {
      title: 'Lead Engineer',
      company: 'Canva',
      location: 'Ankara, Turkey',
      logo: '/logo-landing/canva.png',
      tags: ['Full-Time', 'Marketing', 'Design'],
      applied: 5,
      capacity: 10,
    },
    {
      title: 'Product Designer',
      company: 'ClassPass',
      location: 'Berlin, Germany',
      logo: '/logo-landing/webflow.webp',
      tags: ['Full-Time', 'Marketing', 'Design'],
      applied: 5,
      capacity: 10,
    },
    {
      title: 'Customer Manager',
      company: 'Pitch',
      location: 'Berlin, Germany',
      logo: '/logo-landing/twitter.webp',
      tags: ['Full-Time', 'Marketing', 'Design'],
      applied: 5,
      capacity: 10,
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-64">
          <JobFilterSidebar />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">All Jobs</h1>
              <p className="text-sm text-gray-500">Showing 73 results</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  Most relevant
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <div className="flex rounded border">
                <button className="border-r p-2">
                  <Grid className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-2">
                  <List className="h-4 w-4 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {jobData.map((job, index) => (
              <JobCard
                key={index}
                title={job.title}
                company={job.company}
                location={job.location}
                logo={job.logo}
                tags={job.tags}
                applied={job.applied}
                capacity={job.capacity}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination totalPages={33} currentPage={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
