import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function JobBoard() {
  const jobs = [
    {
      id: 1,
      title: 'Email Marketing',
      company: 'Revolut',
      location: 'Madrid, Spain',
      description: 'Revolut is looking for Email Marketing to help team ma...',
      tags: ['Marketing', 'Design'],
      logo: '/logo-landing/revolut.jpg',
    },
    {
      id: 2,
      title: 'Brand Designer',
      company: 'Dropbox',
      location: 'San Fransisco, US',
      description:
        'Dropbox is looking for Brand Designer to help the team t...',
      tags: ['Design', 'Business'],
      logo: '/logo-landing/dropbox.png',
    },
    {
      id: 3,
      title: 'Email Marketing',
      company: 'Pitch',
      location: 'Berlin, Germany',
      description:
        'Pitch is looking for Customer Manager to join marketing t...',
      tags: ['Marketing'],
      logo: '/logo-landing/pitch.webp',
    },
    {
      id: 4,
      title: 'Visual Designer',
      company: 'Blinkist',
      location: 'Granada, Spain',
      description:
        'Blinkist is looking for Visual Designer to help team desi...',
      tags: ['Design'],
      logo: '/logo-landing/Blinkist.jpg',
    },
    {
      id: 5,
      title: 'Product Designer',
      company: 'ClassPass',
      location: 'Manchester, UK',
      description: 'ClassPass is looking for Product Designer to help us...',
      tags: ['Marketing', 'Design'],
      logo: '/logo-landing/classpass.jfif',
    },
    {
      id: 6,
      title: 'Lead Designer',
      company: 'Canva',
      location: 'Ontario, Canada',
      description: 'Canva is looking for Lead Engineer to help develop n...',
      tags: ['Design', 'Business'],
      logo: '/logo-landing/canva.png',
    },
    {
      id: 7,
      title: 'Brand Strategist',
      company: 'GoDaddy',
      location: 'Marseille, France',
      description:
        'GoDaddy is looking for Brand Strategist to join the team...',
      tags: ['Marketing'],
      logo: '/logo-landing/GoDaddy.webp',
    },
    {
      id: 8,
      title: 'Data Analyst',
      company: 'Twitter',
      location: 'San Diego, US',
      description: 'Twitter is looking for Data Analyst to help team desi...',
      tags: ['Technology'],
      logo: '/logo-landing/twitter.webp',
    },
  ];

  return (
    <div className="bg-[#1A1B26] px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Featured<span className="text-[#3B82F6]">jobs</span>
          </h2>
          <a
            href="#"
            className="flex items-center text-sm text-[#3B82F6] hover:underline md:text-base"
          >
            Show all jobs <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  return (
    <div>
      <div className="flex h-full flex-col rounded-lg bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-300">
            <Image
              src={job.logo || '/placeholder.svg'}
              alt={`${job.company} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="rounded border border-gray-300 px-2 py-1 text-xs">
            Full Time
          </span>
        </div>

        <h3 className="mb-1 text-lg font-semibold">{job.title}</h3>
        <div className="mb-2 text-sm text-gray-600">
          {job.company} · {job.location}
        </div>

        <p className="mb-4 flex-grow text-sm text-gray-600">
          {job.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {job.tags.map((tag: any) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-xs ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTagColor(tag: any) {
  switch (tag) {
    case 'Marketing':
      return 'bg-amber-100 text-amber-800';
    case 'Design':
      return 'bg-emerald-100 text-emerald-800';
    case 'Business':
      return 'bg-blue-100 text-blue-800';
    case 'Technology':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
