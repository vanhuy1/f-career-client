'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Loader2,
  TrendingUp,
  Building,
  Briefcase,
  Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { jobSearchService } from '@/services/api/job-search/job-search.api';
import { useDebounce } from '@/hooks/use-debounce';
import { useUserLocation } from '@/hooks/use-user-location';
import {
  CommandList,
  CommandGroup,
  CommandItem,
  Command,
} from '@/components/ui/command';
import type {
  SuggestionsResponse,
  SuggestionKeyword,
  SuggestionJob,
  SuggestionCompany,
} from '@/types/JobSearch';

interface JobSearchFormProps {
  initialKeyword?: string;
  initialLocation?: string;
  placeholder?: string;
  className?: string;
  showPopularSearches?: boolean;
  preserveFilters?: boolean;
  searchParams?: URLSearchParams | null;
}

export default function JobSearchForm({
  initialKeyword = '',
  initialLocation = '',
  placeholder = 'Job title or keyword',
  className = '',
  showPopularSearches = true,
  preserveFilters = false,
  searchParams = null,
}: JobSearchFormProps) {
  const router = useRouter();
  const userLocation = useUserLocation();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(
    initialLocation || userLocation || '',
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionsResponse>({
    keywords: [],
    jobs: [],
    companies: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const hasInitializedLocationRef = useRef(false);
  const debouncedKeyword = useDebounce(keyword, 300);

  const popularSearches = [
    'Frontend Developer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
  ];

  // Update location when user's profile location becomes available
  useEffect(() => {
    if (hasInitializedLocationRef.current) return;

    if (initialLocation) {
      setLocation(initialLocation);
      hasInitializedLocationRef.current = true;
      return;
    }

    if (userLocation) {
      setLocation(userLocation);
      hasInitializedLocationRef.current = true;
    }
  }, [userLocation, initialLocation]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedKeyword.length < 2) {
        setSuggestions({ keywords: [], jobs: [], companies: [] });
        return;
      }

      try {
        setLoading(true);
        const response = await jobSearchService.getJobSuggestions({
          q: debouncedKeyword,
        });
        setSuggestions(response);
        if (
          response.keywords.length > 0 ||
          response.jobs.length > 0 ||
          response.companies.length > 0
        ) {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Mock suggestions for demo
        setSuggestions({
          keywords: [
            { value: `${debouncedKeyword} Developer`, type: 'keyword' },
            { value: `Senior ${debouncedKeyword}`, type: 'keyword' },
            { value: `${debouncedKeyword} Engineer`, type: 'keyword' },
            { value: `Junior ${debouncedKeyword}`, type: 'keyword' },
          ],
          jobs: [],
          companies: [],
        });
        setShowSuggestions(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);

    // Create URL parameters for search
    let params: URLSearchParams;

    if (preserveFilters && searchParams) {
      // Preserve existing filter parameters
      params = new URLSearchParams(searchParams.toString());
    } else {
      // Start fresh
      params = new URLSearchParams();
    }

    // Update or clear search parameters
    if (keyword) {
      params.set('q', keyword);
    } else {
      params.delete('q');
    }

    if (location) {
      params.set('location', location);
    } else {
      params.delete('location');
    }

    // Reset page to 1 when performing a new search
    params.set('page', '1');

    // Navigate to job search page
    router.push(`/job?${params.toString()}`);
  };

  const handleKeywordClick = (keyword: SuggestionKeyword) => {
    setKeyword(keyword.value);
    setShowSuggestions(false);
    // Keep focus on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleJobClick = (job: SuggestionJob) => {
    setShowSuggestions(false);
    router.push(`/job/${job.id}`);
  };

  const handleCompanyClick = (company: SuggestionCompany) => {
    setShowSuggestions(false);
    router.push(`/company/${company.id}`);
  };

  const handlePopularClick = (popular: string) => {
    setKeyword(popular);
    // Keep focus on the input field and don't close the suggestions
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`rounded-lg border border-gray-300 bg-white p-3 shadow-sm ${className}`}
    >
      <div className="relative flex flex-col gap-3 md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="h-11 w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (e.target.value.length >= 2) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onClick={() =>
              keyword.length >= 2 &&
              (suggestions.keywords.length > 0 ||
                suggestions.jobs.length > 0 ||
                suggestions.companies.length > 0) &&
              setShowSuggestions(true)
            }
            autoComplete="off"
          />
        </div>

        <div className="relative flex-grow">
          <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <input
            type="text"
            className="h-11 w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <Button
            type="submit"
            className="h-11 bg-gray-900 px-6 text-white hover:bg-gray-800"
          >
            Search
          </Button>
        </div>

        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 mt-12 w-full overflow-hidden rounded-md shadow-lg"
          >
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
              <Command className="border-0">
                <CommandList className="max-h-[24rem]">
                  {loading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Searching...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-0">
                        <div className="border-r border-gray-100">
                          {suggestions.keywords.length > 0 && (
                            <CommandGroup>
                              <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium text-gray-600 uppercase">
                                Keywords
                              </div>
                              {suggestions.keywords
                                .slice(0, 3)
                                .map((keyword, index) => (
                                  <CommandItem
                                    key={`keyword-${index}`}
                                    onSelect={() => handleKeywordClick(keyword)}
                                    className="cursor-pointer border-b border-gray-50 px-3 py-2.5 transition-colors duration-150 last:border-b-0 hover:bg-gray-50"
                                  >
                                    <div className="flex w-full items-center gap-3">
                                      <div className="flex-shrink-0">
                                        <Hash className="h-4 w-4 text-gray-500" />
                                      </div>
                                      <div className="flex-grow">
                                        <span className="text-sm text-gray-900">
                                          {keyword.value}
                                        </span>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          )}

                          {suggestions.companies.length > 0 && (
                            <CommandGroup>
                              <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium text-gray-600 uppercase">
                                Companies
                              </div>
                              {suggestions.companies
                                .slice(0, 2)
                                .map((company, index) => (
                                  <CommandItem
                                    key={`company-${index}`}
                                    onSelect={() => handleCompanyClick(company)}
                                    className="cursor-pointer border-b border-gray-50 px-3 py-2.5 transition-colors duration-150 last:border-b-0 hover:bg-gray-50"
                                  >
                                    <div className="flex w-full items-center gap-3">
                                      <div className="flex-shrink-0">
                                        {company.logoUrl ? (
                                          <Image
                                            src={
                                              company.logoUrl ||
                                              '/placeholder.svg'
                                            }
                                            alt={`${company.name} logo`}
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 rounded object-cover"
                                          />
                                        ) : (
                                          <Building className="h-4 w-4 text-gray-500" />
                                        )}
                                      </div>
                                      <div className="flex-grow">
                                        <div>
                                          <span className="block text-sm text-gray-900">
                                            {company.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {company.industry}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          )}

                          {keyword.length < 2 && showPopularSearches && (
                            <CommandGroup>
                              <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium text-gray-600 uppercase">
                                Popular Searches
                              </div>
                              {popularSearches.map((popular, index) => (
                                <CommandItem
                                  key={`popular-${index}`}
                                  onSelect={() => handlePopularClick(popular)}
                                  className="cursor-pointer border-b border-gray-50 px-3 py-2.5 transition-colors duration-150 last:border-b-0 hover:bg-gray-50"
                                >
                                  <div className="flex w-full items-center gap-3">
                                    <div className="flex-shrink-0">
                                      <TrendingUp className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div className="flex-grow">
                                      <span className="text-sm text-gray-900">
                                        {popular}
                                      </span>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </div>

                        <div>
                          {suggestions.jobs.length > 0 && (
                            <CommandGroup>
                              <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium text-gray-600 uppercase">
                                Jobs
                              </div>
                              {suggestions.jobs
                                .slice(0, 5)
                                .map((job, index) => (
                                  <CommandItem
                                    key={`job-${index}`}
                                    onSelect={() => handleJobClick(job)}
                                    className="cursor-pointer border-b border-gray-50 px-3 py-2.5 transition-colors duration-150 last:border-b-0 hover:bg-gray-50"
                                  >
                                    <div className="flex w-full items-center gap-3">
                                      <div className="flex-shrink-0">
                                        {job.companyLogo ? (
                                          <Image
                                            src={
                                              job.companyLogo ||
                                              '/placeholder.svg'
                                            }
                                            alt={`${job.companyName} logo`}
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 rounded object-cover"
                                          />
                                        ) : (
                                          <Briefcase className="h-4 w-4 text-gray-500" />
                                        )}
                                      </div>
                                      <div className="flex-grow">
                                        <div>
                                          <span className="block text-sm text-gray-900">
                                            {job.title}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {job.companyName} • {job.location}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          )}
                        </div>
                      </div>

                      {suggestions.keywords.length === 0 &&
                        suggestions.jobs.length === 0 &&
                        suggestions.companies.length === 0 &&
                        keyword.length >= 2 &&
                        !loading && (
                          <div className="px-3 py-6 text-center">
                            <div className="mb-2 text-gray-400">
                              <Search className="mx-auto mb-2 h-6 w-6 opacity-50" />
                            </div>
                            <p className="text-sm text-gray-600">
                              No suggestions found
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Try a different keyword or check your spelling
                            </p>
                          </div>
                        )}
                    </>
                  )}
                </CommandList>
              </Command>

              {/* Footer with keyboard hint */}
              <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Press Enter to search</span>
                  <div className="flex items-center gap-1">
                    <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs">
                      ↑
                    </kbd>
                    <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs">
                      ↓
                    </kbd>
                    <span className="ml-1">to navigate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
