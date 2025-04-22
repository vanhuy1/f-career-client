import ROUTES from '@/constants/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface CompanyCardProps {
  logo: string;
  name: string;
  description: string;
  companyJobCount: number;
  tags: string[];
  primaryColor: string;
}

export default function CompanyCard({
  logo,
  name,
  description,
  companyJobCount,
  tags,
  primaryColor,
}: CompanyCardProps) {
  const companySlug = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link
      href={`${ROUTES.HOMEPAGE.COMPANY.path}/${companySlug}`}
      className="no-underline"
    >
      <div className="rounded-lg border p-6 transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-md"
            style={{ backgroundColor: primaryColor }}
          >
            <Image
              src={logo || '/placeholder.svg'}
              alt={`${name} logo`}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="font-medium text-indigo-600">
            {companyJobCount} Jobs
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold">{name}</h3>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{description}</p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`rounded-full px-3 py-1 text-xs ${
                tag === 'Blockchain'
                  ? 'bg-amber-100 text-amber-800'
                  : tag === 'Payment gateway'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
