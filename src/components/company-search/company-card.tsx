// src/components/company-search/company-card.tsx
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CompanyCardProps {
  id: string;
  companyName: string;
  logoUrl: string;
  industry: string;
  description: string;
}

export default function CompanyCard({
  id,
  companyName,
  logoUrl,
  industry,
  description,
}: CompanyCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/company/${id}`);
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-4 p-4">
        {/* Logo */}
        <div className="shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded bg-gray-100">
            <Image
              src={logoUrl}
              alt={`${companyName} logo`}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{companyName}</h3>
          <p className="text-sm text-gray-600">{industry}</p>
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {description}
          </p>
        </div>

        {/* View button */}
        <div className="flex shrink-0 flex-col items-center justify-between">
          <Button
            className="w-28 bg-indigo-600 hover:bg-indigo-700"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
