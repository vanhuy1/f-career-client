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
      className="cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Logo */}
        <div className="shrink-0">
          <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={logoUrl}
              alt={`${companyName} logo`}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-sm font-semibold text-gray-800"
            title={companyName}
          >
            {companyName}
          </h3>
          <p className="truncate text-xs text-gray-600">{industry}</p>
          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>

        {/* View button */}
        <div className="flex shrink-0 items-center">
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-gray-300 px-3 text-xs text-gray-700 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
