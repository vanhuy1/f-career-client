'use client';

import { Company } from '@/types/Company';
import { FileText, Info } from 'lucide-react';

interface CompanyProfileSectionProps {
  company: Company;
}

export default function CompanyProfileSection({
  company,
}: CompanyProfileSectionProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-slate-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
          <p className="mt-1 text-sm text-gray-600">
            Learn more about our story and mission
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {company.description ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-base leading-relaxed text-gray-700">
              {company.description}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <Info className="h-5 w-5 flex-shrink-0 text-gray-400" />
            <p className="text-gray-600 italic">
              No company description available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </div>
  );
}
