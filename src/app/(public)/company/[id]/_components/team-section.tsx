'use client';

import Image from 'next/image';
import { Company } from '@/types/Company';
import { Users, User, Briefcase } from 'lucide-react';

interface TeamSectionProps {
  company: Company;
}

export default function TeamSection({ company }: TeamSectionProps) {
  if (!company.coreTeam || company.coreTeam.length === 0) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-purple-50 to-pink-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-8 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3 shadow-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="mt-1 text-sm text-gray-600">
            The people behind our success
          </p>
        </div>
      </div>

      {/* Team Cards */}
      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {company.coreTeam.map((member) => (
          <div
            key={member.id}
            className="group/card relative overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Card background decoration */}
            <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-50 transition-transform duration-500 group-hover/card:scale-110"></div>

            <div className="relative flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-2xl shadow-lg ring-4 ring-white">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                    <User className="h-10 w-10 text-purple-600" />
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover/card:text-purple-600">
                  {member.name}
                </h3>

                <div className="flex items-center justify-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    {member.position}
                  </span>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Team summary */}
      <div className="relative mt-6 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
        <div className="text-center">
          <p className="text-sm font-medium text-purple-700">
            {company.coreTeam.length} core team member
            {company.coreTeam.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
    </div>
  );
}
