import ROUTES from '@/constants/navigation';
import Link from 'next/link';

interface BreadcrumbNavigationProps {
  company: {
    companyName: string;
  };
  jobTitle?: {
    title: string;
  };
  companyId?: string;
}

const BreadcrumbNavigation = ({
  company,
  jobTitle,
  companyId,
}: BreadcrumbNavigationProps) => {
  const formattedCompany = company.companyName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <nav className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link href={ROUTES.HOMEPAGE.path} className="hover:text-gray-700">
            Home
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link
            href={ROUTES.HOMEPAGE.COMPANY.path}
            className="hover:text-gray-700"
          >
            Companies
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link
            href={`${ROUTES.HOMEPAGE.COMPANY.path}/${companyId}`}
            className="hover:text-gray-700"
          >
            {formattedCompany}
          </Link>
        </li>
        {jobTitle?.title && (
          <>
            <li>/</li>
            <li className="font-medium text-gray-900">{jobTitle.title}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
