'use client';

import { Company } from '@/types/Company';
import Image from 'next/image';

interface BenefitsSectionProps {
  company: Company;
}

export default function BenefitsSection({ company }: BenefitsSectionProps) {
  if (!company.benefits || company.benefits.length === 0) return null;

  return (
    <div className="rounded-lg border-b border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold">Benefits</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {company.benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={benefit.iconUrl || '/globe.svg'}
                alt={benefit.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {benefit.name}
              </div>
              <div className="text-xs text-gray-500">{benefit.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
