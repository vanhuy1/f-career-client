'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Loader2,
  TrendingUp,
  Clock,
  ListFilter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { jobSearchService } from '@/services/api/job-search/job-search.api';
import { useDebounce } from '@/hooks/use-debounce';
import {
  CommandList,
  CommandGroup,
  CommandItem,
  Command,
} from '@/components/ui/command';

export default function JobSearchInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams?.get('q') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedKeyword = useDebounce(keyword, 300);

  const popularSearches = [
    'Frontend Developer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
  ];

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
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await jobSearchService.getJobSuggestions({
          q: debouncedKeyword,
        });
        setSuggestions(response.suggestions);
        if (response.suggestions.length > 0) {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Mock suggestions for demo
        setSuggestions([
          `${debouncedKeyword} Developer`,
          `Senior ${debouncedKeyword}`,
          `${debouncedKeyword} Engineer`,
          `Junior ${debouncedKeyword}`,
        ]);
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

    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams(searchParams?.toString());

    // Update or clear search parameters while preserving filter parameters
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

    // Keep all existing filter parameters (they're already in params since we used searchParams)
    router.push(`/job?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setKeyword(suggestion);
    // Keep focus on the input field and don't close the suggestions
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePopularClick = (popular: string) => {
    setKeyword(popular);
    // Keep focus on the input field and don't close the suggestions
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Import from the utils file
  const handleToggleFilters = () => {
    // Using dynamic import to avoid SSR issues with localStorage
    import('@/lib/utils').then(({ toggleFilterVisibility }) => {
      toggleFilterVisibility();
    });
  };

  // Get initial filter visibility
  const [filtersVisible, setFiltersVisible] = useState(true);

  useEffect(() => {
    // Initialize filter visibility state from localStorage
    import('@/lib/utils').then(({ getFilterVisibility }) => {
      setFiltersVisible(getFilterVisibility());
    });

    // Listen for changes from other components
    const handleVisibilityChange = (e: CustomEvent) => {
      setFiltersVisible(e.detail);
    };

    window.addEventListener(
      'filterVisibilityChanged',
      handleVisibilityChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        'filterVisibilityChanged',
        handleVisibilityChange as EventListener,
      );
    };
  }, []);

  return (
    <div className="bg-[#f8f8fd]">
      <div className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
            Find your{' '}
            <span className="relative text-blue-500">
              dream job
              <span className="absolute bottom-0 left-0 h-1 w-full translate-y-1 transform bg-blue-500"></span>
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find your next career at companies like HubSpot, Nike, and Dropbox
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <Search className="absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Job title or keyword"
                className="h-12 w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  suggestions.length > 0 &&
                  setShowSuggestions(true)
                }
                autoComplete="off"
              />

              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl">
                    <Command className="border-0">
                      <CommandList className="max-h-80">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Searching...</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            {suggestions.length > 0 && (
                              <CommandGroup>
                                <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                                  Suggestions
                                </div>
                                {suggestions.map((suggestion, index) => (
                                  <CommandItem
                                    key={`${suggestion}-${index}`}
                                    onSelect={() =>
                                      handleSuggestionClick(suggestion)
                                    }
                                    className="cursor-pointer border-b border-gray-50 px-3 py-3 transition-colors duration-150 last:border-b-0 hover:bg-blue-50"
                                  >
                                    <div className="flex w-full items-center gap-3">
                                      <div className="flex-shrink-0">
                                        <Search className="h-4 w-4 text-gray-400" />
                                      </div>
                                      <div className="flex-grow">
                                        <span className="font-medium text-gray-900">
                                          {suggestion}
                                        </span>
                                      </div>
                                      <div className="flex-shrink-0">
                                        <TrendingUp className="h-3 w-3 text-gray-300" />
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}

                            {keyword.length < 2 && (
                              <CommandGroup>
                                <div className="border-b border-gray-100 px-3 py-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                                  Popular Searches
                                </div>
                                {popularSearches.map((popular, index) => (
                                  <CommandItem
                                    key={`popular-${index}`}
                                    onSelect={() => handlePopularClick(popular)}
                                    className="cursor-pointer border-b border-gray-50 px-3 py-3 transition-colors duration-150 last:border-b-0 hover:bg-blue-50"
                                  >
                                    <div className="flex w-full items-center gap-3">
                                      <div className="flex-shrink-0">
                                        <TrendingUp className="h-4 w-4 text-blue-500" />
                                      </div>
                                      <div className="flex-grow">
                                        <span className="font-medium text-gray-900">
                                          {popular}
                                        </span>
                                      </div>
                                      <div className="flex-shrink-0">
                                        <Clock className="h-3 w-3 text-gray-300" />
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}

                            {suggestions.length === 0 &&
                              keyword.length >= 2 &&
                              !loading && (
                                <div className="px-3 py-8 text-center">
                                  <div className="mb-2 text-gray-400">
                                    <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                  </div>
                                  <p className="text-sm font-medium text-gray-500">
                                    No suggestions found
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    Try a different keyword or check your
                                    spelling
                                  </p>
                                </div>
                              )}
                          </>
                        )}
                      </CommandList>
                    </Command>

                    {/* Footer with keyboard hint */}
                    <div className="border-t border-gray-100 bg-gray-50 px-3 py-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Press Enter to search</span>
                        <div className="flex items-center gap-1">
                          <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs">
                            ↑
                          </kbd>
                          <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs">
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

            <div className="relative flex-grow">
              <MapPin className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                className="h-12 w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className={`flex h-12 items-center gap-2 px-4 transition-colors ${
                  filtersVisible
                    ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                onClick={handleToggleFilters}
                title={filtersVisible ? 'Hide filters' : 'Show filters'}
              >
                <ListFilter
                  className={`h-5 w-5 ${filtersVisible ? 'text-blue-600' : 'text-gray-500'}`}
                />
                <span className="hidden md:inline">
                  {filtersVisible ? 'Hide' : 'Show'} Filters
                </span>
              </Button>
              <Button
                type="submit"
                className="h-12 bg-blue-600 px-8 hover:bg-blue-700"
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-4 text-gray-500">
          <span>Popular: </span>
          <span className="text-gray-600">
            UI Designer, UX Researcher, Android, Admin
          </span>
        </div>
      </div>
    </div>
  );
}
