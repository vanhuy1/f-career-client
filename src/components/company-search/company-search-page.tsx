import { ChevronDown, Grid, List } from 'lucide-react';
import CompanyCard from '@/components/company-search/company-card';
import Pagination from '@/components/company-search/pagination';
import FilterSidebar from './filter-sidebar';
import { companyData } from '@/data/Company';

export default function CompanySearchPage() {
  return (
    <div className="max-w-8xl container mx-auto p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-64">
          <FilterSidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">All Companies</h1>
              <p className="text-muted-foreground text-sm">
                Showing 73 results
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  Most relevant
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <div className="flex rounded border">
                <button className="border-r p-2">
                  <Grid className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-2">
                  <List className="h-4 w-4 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {companyData.map((co, index) => (
              <CompanyCard
                key={index}
                logo={co.logo}
                name={co.name}
                description={co.description}
                companyJobCount={co.jobCount}
                tags={co.tags}
                primaryColor={co.primaryColor}
              />
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination currentPage={2} totalPages={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
