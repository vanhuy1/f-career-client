import { companyData } from '@/data/Company';
import Link from 'next/link';

interface CompanyOfficeLocationsProps {
  company: (typeof companyData)[number];
}

export default function CompanyOfficeLocations({
  company,
}: CompanyOfficeLocationsProps) {
  return (
    <div className="mt-12">
      <h2 className="mb-4 text-2xl font-bold">Office Location</h2>
      <p className="mb-6 text-gray-600">
        {company.name} offices spread across {company.location}
      </p>
      {company.officeLocations && company.officeLocations.length > 0 ? (
        <div className="space-y-4">
          {company.officeLocations.map((location, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-2xl">{location.flag}</span>
              <span>{location.country}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No office location information available.
        </p>
      )}
      {company.officeLocations && company.officeLocations.length > 0 && (
        <div className="mt-6">
          <Link
            href="#"
            className="flex items-center text-indigo-600 hover:underline"
          >
            View countries <span className="ml-2">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
