'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ROUTES from '@/constants/navigation';

type Position = {
  title: string;
  company: string;
  location: string;
  icon: React.ReactNode;
  iconBg: string;
  tags: {
    text: string;
    bg: string;
    textColor: string;
  }[];
};

export default function OpenPositionsSection() {
  const router = useRouter();
  const [positions] = useState<Position[]>([
    {
      title: 'Social Media Assistant',
      company: 'Nomad',
      location: 'Paris, France',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      iconBg: 'bg-emerald-100',
      tags: [
        {
          text: 'Full Time',
          bg: 'bg-emerald-100',
          textColor: 'text-emerald-700',
        },
        {
          text: 'Marketing',
          bg: 'bg-orange-100',
          textColor: 'text-orange-700',
        },
        { text: 'Design', bg: 'bg-blue-100', textColor: 'text-blue-700' },
      ],
    },
    {
      title: 'Brand Designer',
      company: 'Dropbox',
      location: 'San Francisco, USA',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        >
          <path d="M2 16.1A5 5 0 015.9 20M2 12.05A9 9 0 019.95 20M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6" />
          <path d="M2 20h.01" />
        </svg>
      ),
      iconBg: 'bg-blue-100',
      tags: [
        {
          text: 'Full Time',
          bg: 'bg-emerald-100',
          textColor: 'text-emerald-700',
        },
        {
          text: 'Marketing',
          bg: 'bg-orange-100',
          textColor: 'text-orange-700',
        },
        { text: 'Design', bg: 'bg-blue-100', textColor: 'text-blue-700' },
      ],
    },
  ]);

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Open Positions</h2>
      </div>
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div key={index} className="rounded-lg border bg-white p-4">
            <div className="flex items-start gap-3">
              <div className={`${position.iconBg} rounded-lg p-2`}>
                {position.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{position.title}</h3>
                <div className="mt-1 text-xs text-gray-500">
                  {position.company} • {position.location}
                </div>
                <div className="mt-2 flex gap-2">
                  {position.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      className={`${tag.bg} ${tag.textColor} hover:${tag.bg} text-xs font-normal`}
                    >
                      {tag.text}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          variant="link"
          size="sm"
          className="flex items-center gap-1 p-0 text-indigo-600"
          onClick={() => router.push(ROUTES.CO.HOME.JOBLIST.path)}
        >
          Show all jobs
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
