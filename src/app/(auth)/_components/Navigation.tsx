import React from 'react';

interface NavigationProps {
  activeTab?: 'jobseeker' | 'company';
  onTabChange?: (tab: 'jobseeker' | 'company') => void;
}

const Navigation = ({
  activeTab = 'jobseeker',
  onTabChange,
}: NavigationProps) => (
  <div className="mb-8 flex justify-center space-x-4 text-sm">
    <button
      onClick={() => onTabChange?.('jobseeker')}
      className={`rounded-full px-6 py-2 transition-all ${
        activeTab === 'jobseeker'
          ? 'bg-blue-600 text-white'
          : 'text-gray-500 hover:text-blue-600'
      }`}
    >
      Job Seeker
    </button>
    <button
      onClick={() => onTabChange?.('company')}
      className={`rounded-full px-6 py-2 transition-all ${
        activeTab === 'company'
          ? 'bg-blue-600 text-white'
          : 'text-gray-500 hover:text-blue-600'
      }`}
    >
      Company
    </button>
  </div>
);

export default Navigation;
