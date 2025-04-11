import { ChevronDown, MapPin, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function HeroSection() {
  return (
    <div className="bg-[#1a1d29] text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Text */}
        <div className="max-w-3xl">
          <h1 className="mb-2 text-5xl font-bold md:text-6xl">
            Discover
            <br />
            more than
            <br />
            <span className="text-[#0a9de7]">5000+ Jobs</span>
          </h1>

          {/* Blue Underline */}
          <div className="relative mb-6 h-[30px] w-[300px]">
            <div className="absolute top-0 left-0 w-full">
              <svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 18C35.6667 6 138.8 -9.6 298 18"
                  stroke="#0a9de7"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="mb-8 max-w-lg text-gray-300">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>

          {/* Search Form */}
          <div className="flex flex-col rounded-md bg-white p-2 md:flex-row">
            {/* Job Search Input */}
            <div className="flex flex-1 items-center border-b border-gray-200 p-2 md:border-r md:border-b-0">
              <Search size={20} className="mr-2 text-gray-400" />
              <Input
                type="text"
                placeholder="Job title or keyword"
                className="border-none text-black shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Location Dropdown */}
            <div className="flex flex-1 items-center border-b border-gray-200 p-2 md:border-r md:border-b-0">
              <MapPin size={20} className="mr-2 text-gray-400" />
              <div className="flex w-full items-center justify-between text-black">
                <span>Florence, Italy</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <div className="p-2">
              <Button className="w-full bg-[#5e5cff] text-white hover:bg-[#4b49ff]">
                Search my job
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-4 text-sm text-gray-300">
            <span className="mr-2">Popular :</span>
            <span className="text-white">
              UI Designer, UX Researcher, Android, Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
