'use client';

import type { ApplicationStatus } from '@/types/Application';

interface StatusTabsProps {
  activeTab: ApplicationStatus | 'ALL';
  onTabChange: (tab: ApplicationStatus | 'ALL') => void;
  statusCounts: {
    ALL: number;
    IN_REVIEW: number;
    INTERVIEWING: number;
    ASSESSMENT: number;
    OFFERED: number;
    HIRED: number;
  };
}

export default function StatusTabs({
  activeTab,
  onTabChange,
  statusCounts,
}: StatusTabsProps) {
  const tabs = [
    { id: 'ALL', label: 'All', count: statusCounts.ALL },
    { id: 'IN_REVIEW', label: 'In Review', count: statusCounts.IN_REVIEW },
    {
      id: 'INTERVIEWING',
      label: 'Interviewing',
      count: statusCounts.INTERVIEWING,
    },
    { id: 'ASSESSMENT', label: 'Assessment', count: statusCounts.ASSESSMENT },
    { id: 'OFFERED', label: 'Offered', count: statusCounts.OFFERED },
    { id: 'HIRED', label: 'Hired', count: statusCounts.HIRED },
  ];

  return (
    <div className="border-b">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as ApplicationStatus | 'ALL')}
            className={`relative px-1 py-4 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
