import { ArrowRight } from 'lucide-react';
import JobCard from './job-card';

// Job data structure
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  categories: string[];
  logo: string;
}

// Sample job data
const jobs: Job[] = [
  {
    id: 1,
    title: 'Social Media Assistant',
    company: 'Nomad',
    location: 'Paris, France',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/nomad.png',
  },
  {
    id: 2,
    title: 'Social Media Assistant',
    company: 'Netlify',
    location: 'Paris, France',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/netlify.webp',
  },
  {
    id: 3,
    title: 'Brand Designer',
    company: 'Dropbox',
    location: 'San Fransisco, USA',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/dropbox.png',
  },
  {
    id: 4,
    title: 'Brand Designer',
    company: 'Maze',
    location: 'San Fransisco, USA',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/maze.png',
  },
  {
    id: 5,
    title: 'Interactive Developer',
    company: 'Terraform',
    location: 'Hamburg, Germany',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/terraform.png',
  },
  {
    id: 6,
    title: 'Interactive Developer',
    company: 'Udacity',
    location: 'Hamburg, Germany',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/udacity.png',
  },
  {
    id: 7,
    title: 'HR Manager',
    company: 'Packer',
    location: 'Lucern, Switzerland',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/packer.avif',
  },
  {
    id: 8,
    title: 'HR Manager',
    company: 'Webflow',
    location: 'Lucern, Switzerland',
    type: 'Full-Time',
    categories: ['Marketing', 'Design'],
    logo: '/logo-landing/webflow.webp',
  },
];

export default function JobBoardS() {
  return (
    <main className="min-h-screen bg-[#1a1d25] px-4 py-16 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold md:text-5xl">
              Latest <span className="text-[#3b82f6]">jobs open</span>
            </h1>
            <a
              href="#"
              className="flex items-center gap-2 text-[#6366f1] transition-colors hover:text-[#818cf8]"
            >
              Show all jobs <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
