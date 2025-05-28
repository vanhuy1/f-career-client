'use client';

import Image from 'next/image';
import { Company } from '@/types/Company';

interface TeamSectionProps {
  company: Company;
}

export default function TeamSection({ company }: TeamSectionProps) {
  if (!company.coreTeam || company.coreTeam.length === 0) return null;

  return (
    <div className="rounded-lg border-b border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold">Team</h2>

      {/* Team Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {company.coreTeam.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={member.imageUrl || '/team-meeting.jpg'}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {member.name}
              </div>
              <div className="text-xs text-gray-500">{member.position}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
