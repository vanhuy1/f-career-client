import CompanySearch from '@/app/(public)/_components/company-search';
import CompanySearchPage from '@/components/company-search/company-search-page';

const BrowseCompanyPage = () => {
  return (
    <div>
      <CompanySearch />
      <CompanySearchPage />
    </div>
  );
};

export default BrowseCompanyPage;
