'use client';
import CompanyCard from '@/components/company-search/company-card';
import Pagination from '@/components/company-search/pagination';
import { useCallback, useEffect, useState } from 'react';
import { companySearchService } from '@/services/api/company-seach/company-search.api';
import { CompanySearchItem } from '@/types/CompanySearch';
import LoadingScreen from '@/pages/LoadingScreen';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompanySearchPageProps {
  searchQuery?: string;
}

export default function CompanySearchPage({
  searchQuery,
}: CompanySearchPageProps) {
  const [companies, setCompanies] = useState<CompanySearchItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [industries, setIndustries] = useState<string[]>([]);
  const [_isLoadingIndustries, setIsLoadingIndustries] = useState(false);
  const limit = 10;

  const fetchCompanies = useCallback(
    async (currentPage: number = 1, query?: string, industry?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const industryFilter = industry || selectedIndustry;
        const searchParams: {
          q?: string;
          page: number;
          limit: number;
          industry?: string;
        } = {
          q: query || searchQuery,
          page: currentPage,
          limit,
        };

        // Only add industry filter if it's not "all"
        if (industryFilter && industryFilter !== 'all') {
          searchParams.industry = industryFilter;
        }

        const response =
          await companySearchService.searchCompanies(searchParams);

        setCompanies(response.data);
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError(error as string);
        setCompanies([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, selectedIndustry],
  );

  const fetchIndustries = async () => {
    try {
      setIsLoadingIndustries(true);
      const response = await companySearchService.getIndustries();
      setIndustries(response);
    } catch (error) {
      console.error('Error fetching industries:', error);
    } finally {
      setIsLoadingIndustries(false);
    }
  };

  // Fetch industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  // Fetch companies when search query, page, or industry changes
  useEffect(() => {
    fetchCompanies(page, searchQuery, selectedIndustry);
  }, [page, searchQuery, selectedIndustry, fetchCompanies]);

  // Reset page when search query or industry changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedIndustry]);

  const totalPages = Math.ceil(totalItems / limit);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-lg font-medium text-gray-900">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'All Companies'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Showing {totalItems} results
                {selectedIndustry &&
                  selectedIndustry !== 'all' &&
                  ` in ${selectedIndustry}`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              {/* Industry Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Industry:</span>
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          {companies.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <h2 className="mb-2 text-lg font-medium text-gray-700">
                  No companies found
                </h2>
                <p className="text-sm text-gray-600">
                  {searchQuery ||
                  (selectedIndustry && selectedIndustry !== 'all')
                    ? `No companies found ${searchQuery ? `for "${searchQuery}"` : ''} ${selectedIndustry && selectedIndustry !== 'all' ? `in ${selectedIndustry} industry` : ''}`
                    : 'No companies available at the moment'}
                </p>
                {(searchQuery ||
                  (selectedIndustry && selectedIndustry !== 'all')) && (
                  <button
                    onClick={() => {
                      setSelectedIndustry('all');
                    }}
                    className="mt-2 text-sm text-gray-700 underline hover:text-gray-900"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {companies.map((co) => (
                    <CompanyCard
                      key={co.id}
                      id={co.id}
                      companyName={co.companyName}
                      logoUrl={co.logoUrl || '/placeholder.svg'}
                      industry={co.industry || '–'}
                      description="" // CompanySearchItem doesn't have description
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {companies.map((co) => (
                    <CompanyCard
                      key={co.id}
                      id={co.id}
                      companyName={co.companyName}
                      logoUrl={co.logoUrl || '/placeholder.svg'}
                      industry={co.industry || '–'}
                      description="" // CompanySearchItem doesn't have description
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
