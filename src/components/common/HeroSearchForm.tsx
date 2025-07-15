'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { jobSearchService } from '@/services/api/job-search/job-search.api';
import { useDebounce } from '@/hooks/use-debounce';
import { useUserLocation } from '@/hooks/use-user-location';
import {
  CommandList,
  CommandGroup,
  CommandItem,
  Command,
} from '@/components/ui/command';

interface HeroSearchFormProps {
  initialKeyword?: string;
  initialLocation?: string;
}

export default function HeroSearchForm({
  initialKeyword = '',
  initialLocation = '',
}: HeroSearchFormProps) {
  const router = useRouter();
  const userLocation = useUserLocation();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(
    initialLocation || userLocation || '',
  );
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

  // Update location when user's profile location becomes available
  useEffect(() => {
    if (userLocation && !initialLocation && !location) {
      setLocation(userLocation);
    }
  }, [userLocation, initialLocation, location]);

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

    // Create URL parameters for search
    const params = new URLSearchParams();

    if (keyword) {
      params.set('q', keyword);
    }

    if (location && location !== 'Florence, Italy') {
      params.set('location', location);
    }

    // Reset page to 1 when performing a new search
    params.set('page', '1');

    // Navigate to job search page
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

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col rounded-md bg-white p-2 shadow-lg md:flex-row"
    >
      {/* Job Search Input */}
      <div className="relative flex flex-1 items-center border-b border-gray-200 p-2 md:border-r md:border-b-0">
        <Search size={20} className="mr-2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Job title or keyword"
          className="w-full border-none text-black shadow-none outline-none focus:ring-0"
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
            className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-lg shadow-lg"
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
                              onSelect={() => handleSuggestionClick(suggestion)}
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
                              Try a different keyword or check your spelling
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

      {/* Location Input */}
      <div className="flex flex-1 items-center border-b border-gray-200 p-2 md:border-r md:border-b-0">
        <MapPin size={20} className="mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="Location"
          className="w-full border-none text-black shadow-none outline-none focus:ring-0"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Search Button */}
      <div className="p-2">
        <Button
          type="submit"
          className="w-full bg-blue-700 text-white hover:bg-blue-900"
        >
          Search my job
        </Button>
      </div>
    </form>
  );
}
