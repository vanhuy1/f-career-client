'use client';

import { useState } from 'react';
import type React from 'react';
import { applications, statusCounts } from '@/data/Applications';
import { Header } from '@/components/job-tracker/header';
import { FeatureNotification } from '@/components/job-tracker/feature-notification';
import { StatusTabs } from '@/components/job-tracker/status-tabs';
import { SearchFilter } from '@/components/job-tracker/search-filter';
import { ApplicationsTable } from '@/components/job-tracker/applications-table';
import { Pagination } from '@/components/job-tracker/pagination';

export default function JobApplicationTracker() {
  const [showNotification, setShowNotification] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter applications based on active tab and search query
  const filteredApplications = applications.filter((app) => {
    // Filter by tab
    if (activeTab !== 'all') {
      const tabStatus = activeTab
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      if (app.status !== tabStatus) return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.company.name.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleOptionsClick = (id: number) => {
    console.log(`Options clicked for application ${id}`);
    // Implement options menu functionality
  };

  const handleFilterClick = () => {
    console.log('Filter button clicked');
    // Implement filter functionality
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header userName="Jake" dateRange="July 19 - July 25" />

      {showNotification && (
        <FeatureNotification
          title="New Feature"
          description="You can request a follow-up 7 days after applying for a job if the application status is in review."
          additionalInfo="Only one follow-up is allowed per job."
          onClose={() => setShowNotification(false)}
        />
      )}

      <StatusTabs
        statusCounts={statusCounts}
        defaultValue={activeTab}
        onChange={handleTabChange}
      />

      <SearchFilter onSearch={handleSearch} onFilter={handleFilterClick} />

      <ApplicationsTable
        applications={filteredApplications}
        onOptionsClick={handleOptionsClick}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={33}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
