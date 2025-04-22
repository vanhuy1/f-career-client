import { companyData } from '@/data/Company';

interface CompanyProfileProps {
  company: (typeof companyData)[number];
}

export default function CompanyProfile({ company }: CompanyProfileProps) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Company Profile</h2>
      <p className="leading-relaxed text-gray-600">
        {company.description || 'No company description available.'}
      </p>
    </div>
  );
}
