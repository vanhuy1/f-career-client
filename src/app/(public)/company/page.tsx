import React from 'react';
import CompanySearch from '../_components/company-search';
import CompanySearchPage from '@/components/company-search/company-search-page';

export default function CompanyLayout() {
  return (
    <>
      <CompanySearch />
      <CompanySearchPage />
    </>
  );
}
