import React from 'react';
import CompanySearch from '../../../components/company-search/company-search-banner';
import CompanySearchPage from '@/components/company-search/company-search-page';

export default function CompanyLayout() {
  return (
    <>
      <CompanySearch />
      <CompanySearchPage />
    </>
  );
}
