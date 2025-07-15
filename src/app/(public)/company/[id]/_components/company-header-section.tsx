'use client';

import { format } from 'date-fns';
import { Users, MapPin, Layers, Building, Globe, Calendar } from 'lucide-react';
import { Company } from '@/types/Company';
import Image from 'next/image';

interface CompanyHeaderSectionProps {
  company: Company;
}

export default function CompanyHeaderSection({
  company,
}: CompanyHeaderSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-8 shadow-2xl backdrop-blur-sm">
      {/* Background pattern */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

      {/* Content */}
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 p-2 shadow-lg ring-4 ring-white/50">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.companyName}
                width={112}
                height={112}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-emerald-200 to-blue-200">
                <Building className="h-16 w-16 text-emerald-700" />
              </div>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
              {company.companyName}
            </h1>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-base text-indigo-600 transition-colors duration-200 hover:text-indigo-700"
              >
                <Globe className="h-4 w-4" />
                <span className="group-hover:underline">{company.website}</span>
              </a>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Founded Date */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Founded
                  </div>
                  <div className="mt-1 text-sm font-bold text-gray-900">
                    {company.foundedAt
                      ? format(new Date(company.foundedAt), 'yyyy')
                      : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            </div>

            {/* Employees */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Employees
                  </div>
                  <div className="mt-1 text-sm font-bold text-gray-900">
                    {company.employees || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            </div>

            {/* Location */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 p-3 shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Location
                  </div>
                  <div
                    className="mt-1 truncate text-sm font-bold text-gray-900"
                    title={company.address?.[0] || 'N/A'}
                  >
                    {company.address?.[0] || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            </div>

            {/* Industry */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 p-3 shadow-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Industry
                  </div>
                  <div
                    className="mt-1 truncate text-sm font-bold text-gray-900"
                    title={company.industry || 'N/A'}
                  >
                    {company.industry || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
