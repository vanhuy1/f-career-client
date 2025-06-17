import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-[#1a1d29] py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-700 p-1.5">
                <CheckCircle size={20} color="white" />
              </div>
              <span className="text-xl font-bold">FCareerConnect</span>
            </div>
            <p className="text-sm text-gray-300">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>

          {/* About Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">About</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Companies
              </Link>
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Advice
              </Link>
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Help Docs
              </Link>
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Guide
              </Link>
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Updates
              </Link>
              <Link
                href="#"
                className="text-gray-300 transition hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Get job notifications</h3>
            <p className="text-sm text-gray-300">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Email Address"
                className="bg-white text-black"
              />
              <Button className="bg-blue-700 text-white hover:bg-blue-900">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-700"></div>

        {/* Copyright and Social */}
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="mb-4 text-sm text-gray-400 md:mb-0">
            2021 @ FCareerConnect. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 transition hover:bg-gray-700"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 transition hover:bg-gray-700"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 transition hover:bg-gray-700"
            >
              <Globe size={18} />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 transition hover:bg-gray-700"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 transition hover:bg-gray-700"
            >
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
