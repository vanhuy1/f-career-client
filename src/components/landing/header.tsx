import Link from "next/link";
import { CheckCircle, Search, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/navigation";

export default function Header() {
  return (
    <header className="bg-[#1a1d29] text-white">
      {/* Navigation Bar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-[#5e5cff] rounded-full p-1.5">
            <CheckCircle size={20} color="white" />
          </div>
          <span className="text-xl font-bold">FCareerConnect</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#" className="hover:text-gray-300 transition">
            Find Jobs
          </Link>
          <Link href="#" className="hover:text-gray-300 transition">
            Browse Companies
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.AUTH.SIGNIN.path}
            className="text-[#5e5cff] hover:text-[#4b49ff] transition">
            {ROUTES.AUTH.SIGNIN.name}
          </Link>
          <Link href={ROUTES.AUTH.SIGNUP.path}>
            <Button className="bg-[#5e5cff] hover:bg-[#4b49ff] text-white">
              {ROUTES.AUTH.SIGNUP.name}
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Text */}
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            Discover
            <br />
            more than
            <br />
            <span className="text-[#0a9de7]">5000+ Jobs</span>
          </h1>

          {/* Blue Underline */}
          <div className="relative w-[300px] h-[30px] mb-6">
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

          <p className="text-gray-300 mb-8 max-w-lg">
            Great platform for the job seeker that searching for new career
            heights and passionate about startups.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-md p-2 flex flex-col md:flex-row">
            {/* Job Search Input */}
            <div className="flex items-center flex-1 border-b md:border-b-0 md:border-r border-gray-200 p-2">
              <Search size={20} className="text-gray-400 mr-2" />
              <Input
                type="text"
                placeholder="Job title or keyword"
                className="border-none shadow-none text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Location Dropdown */}
            <div className="flex items-center flex-1 p-2 border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin size={20} className="text-gray-400 mr-2" />
              <div className="flex items-center justify-between w-full text-black">
                <span>Florence, Italy</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <div className="p-2">
              <Button className="bg-[#5e5cff] hover:bg-[#4b49ff] text-white w-full">
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
    </header>
  );
}
