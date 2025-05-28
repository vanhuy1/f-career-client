'use client';

import { format } from 'date-fns';
import { Clock, Users, MapPin, Layers, Building } from 'lucide-react';
import { Company } from '@/types/Company';
import Image from 'next/image';

interface CompanyHeaderSectionProps {
  company: Company;
}

export default function CompanyHeaderSection({
  company,
}: CompanyHeaderSectionProps) {
  return (
    <div className="mb-8 flex items-start gap-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-emerald-100">
        {company.logoUrl ? (
          <Image
            src={company.logoUrl}
            alt={company.companyName}
            width={96}
            height={96}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <Building className="h-16 w-16 text-emerald-600" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{company.companyName}</h1>
        </div>
        <a
          href={company.website || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-sm text-indigo-600 hover:underline"
        >
          {company.website || 'No website available'}
        </a>
        <div className="mt-6 grid grid-cols-4 gap-8">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-50 p-2">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Founded</div>
              <div className="text-sm font-medium">
                {company.foundedAt
                  ? format(new Date(company.foundedAt), 'MMMM d, yyyy')
                  : 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-50 p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Employees</div>
              <div className="text-sm font-medium">
                {company.employees || 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-50 p-2">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Location</div>
              <div className="text-sm font-medium">
                {company.address?.[0] || 'N/A'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-50 p-2">
              <Layers className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Industry</div>
              <div className="text-sm font-medium">
                {company.industry || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
