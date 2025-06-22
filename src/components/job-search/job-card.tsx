// src/components/job-search/job-card.tsx
'use client';

import { Button } from '@/components/ui/button';
import { CompanyInfo } from '@/types/Job';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  id?: string;
  title: string;
  company: CompanyInfo;
  location: string;
  typeOfEmployment: string;
  category: { id: string; name: string };
}

export default function JobCard({
  id,
  title,
  company,
  location,
  typeOfEmployment,
  category,
}: JobCardProps) {
  const router = useRouter();

  // map typeOfEmployment thành badge style
  const getTypeBadge = (t: string) => {
    switch (t.toLowerCase()) {
      case 'fulltime':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'parttime':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contract':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // map category.name thành badge style (tạm dùng default)
  const getCategoryBadge = () =>
    'bg-indigo-100 text-indigo-800 border-indigo-200';

  const handleCardClick = () => {
    if (id) {
      router.push(`/job/${id}`);
    }
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg border"
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-4 p-4">
        {/* Logo */}
        <div className="shrink-0">
          <div className="h-14 w-14 overflow-hidden rounded bg-gray-100">
            <Image
              src={company.logoUrl || '/placeholder.svg'}
              alt={`${company.companyName} logo`}
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">
            {company.companyName} • {location}
          </p>

          {/* typeOfEmployment & category as badges */}
          <div className="mt-1 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs ${getTypeBadge(typeOfEmployment)}`}
            >
              {typeOfEmployment}
            </span>
            <div className="mt-1 text-sm text-gray-400"> | </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs ${getCategoryBadge()}`}
            >
              {category.name}
            </span>
          </div>

          {/* tags */}
          {/* <div className="mt-2 flex flex-wrap gap-2">
            {(tags ?? []).map((tag, idx) => {
              const getTagStyle = (t: string) => {
                switch (t) {
                  case 'Technology':
                    return 'bg-green-100 text-green-800 border-green-200';
                  case 'Marketing':
                    return 'bg-orange-100 text-orange-800 border-orange-200';
                  case 'Design':
                    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
                  default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
                }
              };
              return (
                <span
                  key={idx}
                  className={`rounded-full border px-3 py-1 text-xs ${getTagStyle(tag)}`}
                >
                  {tag}
                </span>
              );
            })}
          </div> */}
        </div>

        {/* Apply button + Progress */}
        <div className="flex shrink-0 flex-col items-center justify-between">
          <Button className="w-28 bg-blue-600 hover:bg-blue-700">
            View Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
