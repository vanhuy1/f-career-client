'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, TrendingUp, Building, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { companySearchService } from '@/services/api/company-seach/company-search.api';
import { useDebounce } from '@/hooks/use-debounce';
import {
  CommandList,
  CommandGroup,
  CommandItem,
  Command,
} from '@/components/ui/command';
import type {
  CompanySuggestionsResponse,
  CompanySuggestionItem,
} from '@/types/CompanySearch';

interface CompanySearchProps {
  onSearch?: (searchQuery: string) => void;
}

export default function CompanySearch({ onSearch }: CompanySearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CompanySuggestionsResponse>({
    keywords: [],
    companies: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const popularCompanies = [
    'Google',
    'Microsoft',
    'Apple',
    'Facebook',
    'Amazon',
    'Netflix',
  ];

  // Handle outside click to close suggestions
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

  // Fetch suggestions when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.length < 2) {
        setSuggestions({ keywords: [], companies: [] });
        return;
      }

      try {
        setLoading(true);
        const response = await companySearchService.getCompanySuggestions({
          q: debouncedSearchQuery,
        });
        setSuggestions(response);
        if (response.keywords.length > 0 || response.companies.length > 0) {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching company suggestions:', error);
        // Mock suggestions for demo
        setSuggestions({
          keywords: [
            `${debouncedSearchQuery}`,
            `${debouncedSearchQuery} Corp`,
            `${debouncedSearchQuery} Inc`,
          ],
          companies: [],
        });
        setShowSuggestions(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(keyword);
    }
    // Keep focus on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCompanyClick = (company: CompanySuggestionItem) => {
    setShowSuggestions(false);
    router.push(`/company/${company.id}`);
  };

  const handlePopularClick = (popular: string) => {
    setSearchQuery(popular);
    // Keep focus on the input field and don't close the suggestions
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Find Companies
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Discover companies that match your career goals
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-3 rounded-lg border border-gray-300 bg-white p-3 shadow-sm"
        >
          <div className="relative flex flex-col gap-3 md:flex-row">
            <div className="relative flex-grow">
              <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Company name or keyword"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 2) {
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                onClick={() =>
                  searchQuery.length >= 2 &&
                  (suggestions.keywords.length > 0 ||
                    suggestions.companies.length > 0) &&
                  setShowSuggestions(true)
                }
                className="h-11 w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none"
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              className="h-11 bg-gray-900 px-6 text-white hover:bg-gray-800"
            >
              Search
            </Button>

            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 mt-12 w-full max-w-md overflow-hidden rounded-md shadow-lg"
              >
                <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <Command className="border-0">
                    <CommandList className="max-h-[16rem]">
                      {loading ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Searching...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {suggestions.keywords.length > 0 && (
                            <CommandGroup>
                              <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium text-gray-600 uppercase">
                                Keywords
                              </div>
                              {suggestions.keywords
                                .slice(0, 4)
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
                                          {keyword}
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
                                .slice(0, 4)
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

                          {searchQuery.length < 2 && (
                            <CommandGroup>
                              <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium text-gray-600 uppercase">
                                Popular Companies
                              </div>
                              {popularCompanies.map((popular, index) => (
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

                          {suggestions.keywords.length === 0 &&
                            suggestions.companies.length === 0 &&
                            searchQuery.length >= 2 &&
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

        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Popular: </span>
          <span>Google, Microsoft, Apple, Facebook, Amazon, Netflix</span>
        </div>
      </div>
    </div>
  );
}
