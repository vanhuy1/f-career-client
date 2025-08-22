'use client';

import { Building2, Users, Calendar, MapPin, Globe, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CompanyCardProps {
  id: string;
  companyName: string;
  logoUrl: string;
  industry: string;
  website?: string;
  location?: string;
  employees?: number;
  foundedAt?: string;
}

export default function CompanyCard({
  id,
  companyName,
  logoUrl,
  industry,
  website,
  location,
  employees,
  foundedAt,
}: CompanyCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/company/${id}`);
  };

  // Extract domain from website URL for display
  const displayWebsite = website
    ? website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : null;

  // Format founded year for better display
  const formatFoundedYear = (year?: string): string => {
    if (!year) return '';
    // If it's just a year (4 digits), format nicely
    if (/^\d{4}$/.test(year)) {
      return `Founded in ${year}`;
    }
    // If it's a full date, extract year
    const yearMatch = year.match(/\d{4}/);
    if (yearMatch) {
      return `Founded in ${yearMatch[0]}`;
    }
    return `Founded ${year}`;
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-100"
      onClick={handleCardClick}
    >
      {/* Top Company Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg ring-2 ring-white/50 backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 animate-pulse fill-current" />
          <span className="tracking-wide">TOP</span>
        </div>
      </div>

      <div className="p-6">
        {/* Header with Logo and Company Name */}
        <div className="mb-4 flex items-start gap-4">
          <div className="shrink-0">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-2 shadow-sm ring-2 ring-white">
              <Image
                src={logoUrl}
                alt={`${companyName} logo`}
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 pr-8">
            <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
              {companyName}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-blue-600">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{industry}</span>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="mb-4 space-y-2">
          {/* Website */}
          {website && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="truncate">{displayWebsite}</span>
            </div>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Company Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {employees && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{employees}+ employees</span>
              </div>
            )}
            {foundedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">
                  {formatFoundedYear(foundedAt)}
                </span>
              </div>
            )}
          </div>

          {/* View Company Button */}
          <button
            className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View Company
          </button>
        </div>
      </div>

      {/* Gradient Border Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
