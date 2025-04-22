import ROUTES from '@/constants/navigation';
import Link from 'next/link';

interface BreadcrumbNavigationProps {
  company: {
    name: string;
  };
  jobTitle?: {
    title: string;
  };
}

const BreadcrumbNavigation = ({
  company,
  jobTitle,
}: BreadcrumbNavigationProps) => {
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
            href={`${ROUTES.HOMEPAGE.COMPANY.path}/${company.name}`}
            className="hover:text-gray-700"
          >
            {company.name}
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
