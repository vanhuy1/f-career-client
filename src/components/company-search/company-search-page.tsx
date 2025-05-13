'use client';
import { ChevronDown, Grid, List } from 'lucide-react';
import CompanyCard from '@/components/company-search/company-card';
import Pagination from '@/components/company-search/pagination';
import FilterSidebar from './filter-sidebar';
import { useEffect, useState } from 'react';
import { Company } from '@/types/Company';
import { companyService } from '@/services/api/company/company-api';

export default function CompanySearchPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const limit = 10;

  useEffect(() => {
    let mounted = true;
    async function fetchCompanies() {
      try {
        const res = await companyService.findAll(limit, (page - 1) * limit);
        if (!mounted) return;
        setCompanies(res.data);
        setCount(res.meta.count);
      } catch (error) {
        console.error('Lỗi khi fetch companies', error);
      }
    }
    setPage(1);
    fetchCompanies();
    return () => {
      mounted = false;
    };
  }, [page, limit]);

  const totalPages = Math.ceil(count / limit);

  return (
    <div className="max-w-8xl container mx-auto p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-64">
          <FilterSidebar />
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">All Companies</h1>
              <p className="text-muted-foreground text-sm">
                Showing {count} results
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

              {/* View toggle */}
              <div className="flex rounded border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`border-r p-2 ${
                    viewMode === 'grid' ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list' ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {companies.map((co) => (
                <CompanyCard
                  key={co.id}
                  id={co.id}
                  companyName={co.companyName}
                  logoUrl={co.logoUrl || '/placeholder.svg'}
                  industry={co.industry || '–'}
                  description={co.description || ''}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {companies.map((co) => (
                <CompanyCard
                  key={co.id}
                  id={co.id}
                  companyName={co.companyName}
                  logoUrl={co.logoUrl || '/placeholder.svg'}
                  industry={co.industry || '–'}
                  description={co.description || ''}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              // nếu bạn muốn bắt sự kiện chuyển trang:
              // onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
