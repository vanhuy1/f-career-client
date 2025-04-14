import React from 'react';
import CompanySearch from '../_components/company-search';

export default function CompanyLayout() {
  return (
    <>
      <CompanySearch />
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Company</h1>
        <p className="mt-4 text-lg">This is the Company page.</p>
      </div>
    </>
  );
}
