import React from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JobSearchInterface() {
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

        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="h-12 w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="relative flex-grow">
              <MapPin className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <div className="flex h-12 w-full items-center rounded-md border border-gray-200 py-2 pr-4 pl-10 text-gray-700">
                Florence, Italy
                <ChevronDown className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button className="h-12 bg-blue-600 px-8 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>

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
