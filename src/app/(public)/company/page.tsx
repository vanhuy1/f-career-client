'use client';
import React, { useState } from 'react';
import CompanySearch from '../../../components/company-search/company-search-banner';
import CompanySearchPage from '@/components/company-search/company-search-page';

export default function CompanyLayout() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <CompanySearch onSearch={handleSearch} />
      <CompanySearchPage searchQuery={searchQuery} />
    </>
  );
}
