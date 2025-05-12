// src/components/company-search/company-card.tsx
import ROUTES from '@/constants/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface CompanyCardProps {
  id: string;
  companyName: string;
  logoUrl: string;
  industry: string;
  description: string;
  jobCount?: number; // thêm prop jobCount
}

export default function CompanyCard({
  id,
  companyName,
  logoUrl,
  industry,
  description,
  jobCount = 7, // mặc định 7
}: CompanyCardProps) {
  const companySlug = companyName.toLowerCase().replace(/\s+/g, '-');

  const getIndustryBadge = (ind: string) => {
    switch (ind.toLowerCase()) {
      case 'technology':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'finance':
        return 'bg-green-100 text-yellow-800 border-green-200';
      case 'marketing':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  console.log(id); // handle detail company page

  return (
    <Link
      href={`${ROUTES.HOMEPAGE.COMPANY.path}/${companySlug}`}
      className="no-underline"
    >
      <div className="relative rounded-lg border p-6 transition-shadow hover:shadow-md">
        {/* Badge số lượng jobs */}
        <span className="absolute top-2 right-2 rounded bg-white px-5 py-3 text-xs font-medium text-indigo-600">
          {jobCount} Jobs
        </span>

        {/* logo + tên */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
            <Image
              src={logoUrl}
              alt={`${companyName} logo`}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">{companyName}</h3>
          </div>
        </div>

        {/* mô tả */}
        <p className="mb-2 line-clamp-2 text-sm text-gray-700">{description}</p>

        {/* industry as badge */}
        <div className="mt-1">
          <span
            className={`rounded-full border px-3 py-1 text-xs ${getIndustryBadge(industry)}`}
          >
            {industry}
          </span>
        </div>
      </div>
    </Link>
  );
}
