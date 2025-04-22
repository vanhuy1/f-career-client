'use client';

import { useParams } from 'next/navigation';
import { companyData } from '@/data/Company';
import BreadcrumbNavigation from '../../_components/breadcrump-navigation';
import CompanyLogo from '@/components/company-search/co-logo';
import CompanyHeader from '@/components/company-search/co-header';
import CompanyStats from '@/components/company-search/co-stats';
import CompanyProfile from '@/components/company-search/co-profile';
import CompanyContact from '@/components/company-search/co-contact';
import CompanyTechStack from '@/components/company-search/co-tech-stack';
import CompanyOfficeLocations from '@/components/company-search/co-office-locations';
import CompanyOfficeImages from '@/components/company-search/co-office-images';

// Utility function to convert company name to slug
const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

// Main CompanyProfilePage Component
export default function CompanyProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const company =
    companyData.find((c) => toSlug(c.name) === slug) ||
    companyData.find((c) => c.name === 'Stripe')!;

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <BreadcrumbNavigation company={company} />
      <div className="flex flex-col items-start gap-8 md:flex-row">
        <CompanyLogo company={company} />
        <div className="flex-1">
          <CompanyHeader company={company} />
          <CompanyStats company={company} />
        </div>
      </div>
      <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <CompanyProfile company={company} />
            <CompanyContact company={company} />
          </div>
          <div>
            <CompanyTechStack company={company} />
            <CompanyOfficeLocations company={company} />
          </div>
        </div>
      </div>
      {company.name && <CompanyOfficeImages />}
    </div>
  );
}
