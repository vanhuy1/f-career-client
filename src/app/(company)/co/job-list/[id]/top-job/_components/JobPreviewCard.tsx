'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, DollarSign, Clock, Trophy, Star } from 'lucide-react';
import Image from 'next/image';

// Mock job data for preview
export const mockPreviewJobs = [
  {
    id: 1,
    title: 'Senior Full-Stack Software Engineer - React, Node.js, TypeScript',
    company: 'Your Company',
    companyLogo: '/Logo/talkit.svg',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
    type: 'Full-time',
    category: 'Technology',
    postedDate: '2 days ago',
  },
  {
    id: 2,
    title: 'Senior UX/UI Designer - Product Design & User Research Specialist',
    company: 'DesignStudio',
    companyLogo: '/Logo/amd.webp',
    location: 'Austin, TX',
    salary: '$80k - $120k',
    type: 'Full-time',
    category: 'Design',
    postedDate: '3 days ago',
  },
  {
    id: 3,
    title: 'Data Scientist - Machine Learning & AI Specialist',
    company: 'DataFlow',
    companyLogo: '/Logo/talkit.svg',
    location: 'Seattle, WA',
    salary: '$90k - $140k',
    type: 'Full-time',
    category: 'Data Science',
    postedDate: '5 days ago',
  },
  {
    id: 4,
    title:
      'Digital Marketing Specialist - SEO, SEM & Social Media Marketing Expert',
    company: 'GrowthCo',
    companyLogo: '/Logo/talkit.svg',
    location: 'Chicago, IL',
    salary: '$60k - $80k',
    type: 'Full-time',
    category: 'Marketing',
    postedDate: '1 week ago',
  },
  {
    id: 5,
    title: 'Product Manager - Agile & Scrum Master',
    company: 'ProductHub',
    companyLogo: '/Logo/amd.webp',
    location: 'New York, NY',
    salary: '$100k - $150k',
    type: 'Full-time',
    category: 'Management',
    postedDate: '4 days ago',
  },
];

export function getCategoryBadge(category: string) {
  switch (category) {
    case 'Technology':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Management':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Design':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Data Science':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Marketing':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export function getPositionStyles(
  packageType: 'vip' | 'premium' | 'basic' | null,
  position: number,
) {
  if (!packageType) {
    return {
      card: 'border bg-white hover:shadow-sm transition-all duration-200',
      badge: '',
      title: 'text-gray-800',
      border: '',
      effect: '',
    };
  }

  switch (packageType) {
    case 'vip':
      if (position === 1) {
        return {
          card: 'border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-2xl scale-105 ring-2 ring-purple-200 ring-opacity-50',
          badge:
            'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white animate-pulse shadow-lg',
          title: 'text-purple-800 font-bold text-lg',
          border:
            'border-gradient-to-r from-purple-400 via-pink-500 to-orange-400 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_25px_rgba(168,85,247,0.6)] after:animate-pulse',
        };
      }
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
    case 'premium':
      if (position === 2) {
        return {
          card: 'border-2 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl ring-1 ring-indigo-200',
          badge:
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md',
          title: 'text-indigo-800 font-semibold text-lg',
          border: 'border-gradient-to-r from-indigo-400 to-purple-500 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_15px_rgba(99,102,241,0.3)]',
        };
      }
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
    case 'basic':
      if (position === 3) {
        return {
          card: 'border bg-gradient-to-br from-gray-50 to-gray-50/80 shadow-sm',
          badge: 'bg-gradient-to-r from-gray-600 to-gray-600 text-white',
          title: 'text-gray-800 font-medium',
          border: 'border-gray-300',
          effect: '',
        };
      }
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
    default:
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
  }
}

interface JobPreviewCardProps {
  job: (typeof mockPreviewJobs)[0];
  position: number;
  packageType: 'vip' | 'premium' | 'basic' | null;
  isHighlighted: boolean;
}

export function JobPreviewCard({
  job,
  position,
  packageType,
  isHighlighted,
}: JobPreviewCardProps) {
  const styles = getPositionStyles(
    isHighlighted ? packageType : null,
    position,
  );

  const PositionBadge = () => {
    if (position === 1) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-0 bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 text-xs text-white shadow-lg"
        >
          <Trophy className="h-3 w-3" />
          <span className="font-bold">VIP</span>
        </Badge>
      );
    }
    if (position === 2) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-0 bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-1 text-xs text-white shadow-md"
        >
          <Star className="h-3 w-3" /> PREMIUM
        </Badge>
      );
    }
    return null;
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`View details for job: ${job.title}`);
  };

  return (
    <div className="group w-full">
      <div
        className={`w-full cursor-pointer overflow-hidden rounded-lg ${styles.card} relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      >
        {isHighlighted && packageType && packageType !== 'basic' && (
          <div className="absolute top-0 left-0">
            {position === 1 ? (
              <Badge
                className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs font-bold`}
              >
                🔥 HOT
              </Badge>
            ) : position === 2 ? (
              <Badge
                className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs`}
              >
                ⭐ TOP
              </Badge>
            ) : null}
          </div>
        )}

        <div className="flex p-3">
          <div className="mr-3 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={job.companyLogo || '/placeholder.svg'}
                alt={`${job.company} logo`}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <h3
                className={`text-sm font-semibold ${styles.title} truncate`}
                title={job.title}
              >
                {job.title}
              </h3>
              <p className="truncate text-xs text-gray-600">
                {job.company} • {job.location}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                  {job.type}
                </span>
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getCategoryBadge(job.category)}`}
                >
                  {job.category}
                </span>
              </div>
            </div>

            <div className="ml-3 flex flex-col items-end justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{job.postedDate}</span>
              </div>
              <div className="flex items-center gap-1 font-medium text-green-600">
                <DollarSign className="h-3 w-3" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                {isHighlighted && <PositionBadge />}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDetailClick}
                  className={`h-6 px-2 py-1 text-xs transition-all duration-200 hover:shadow-sm ${
                    isHighlighted && packageType === 'vip'
                      ? 'border-purple-300 text-purple-700 hover:bg-purple-50'
                      : isHighlighted && packageType === 'premium'
                        ? 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
