'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { key: 'applicants', label: 'Applicants', href: 'applicants' },
  { key: 'job-details', label: 'Job Details', href: 'job-details' },
  { key: 'settings', label: 'Statistics', href: 'settings' },
];

export function JobNavigation() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const isActive = pathname?.includes(tab.key);

          return (
            <Link
              key={tab.key}
              href={
                pathname?.replace(
                  /\/(applicants|job-details|settings).*$/,
                  `/${tab.href}`,
                ) || tab.href
              }
              className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
