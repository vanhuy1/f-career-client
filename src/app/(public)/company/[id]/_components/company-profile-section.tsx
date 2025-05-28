'use client';

import { Company } from '@/types/Company';

interface CompanyProfileSectionProps {
  company: Company;
}

export default function CompanyProfileSection({
  company,
}: CompanyProfileSectionProps) {
  return (
    <div className="rounded-lg border-b border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900">Company Profile</h2>
      <div className="prose mt-4 max-w-none text-gray-600">
        {company.description || 'No company description available.'}
      </div>
    </div>
  );
}
