import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-[#1a1d29] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#5e5cff] rounded-full p-1.5">
                <CheckCircle size={20} color="white" />
              </div>
              <span className="text-xl font-bold">FCareerConnect</span>
            </div>
            <p className="text-gray-300 text-sm">
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
                className="text-gray-300 hover:text-white transition">
                Companies
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition">
                Pricing
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition">
                Terms
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition">
                Advice
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition">
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
                className="text-gray-300 hover:text-white transition">
                Help Docs
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition">
                Guide
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition">
                Updates
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Get job notifications</h3>
            <p className="text-gray-300 text-sm">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Input
                type="email"
                placeholder="Email Address"
                className="bg-white text-black"
              />
              <Button className="bg-[#5e5cff] hover:bg-[#4b49ff] text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Copyright and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            2021 @ FCareerConnect. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <Facebook size={18} />
            </Link>
            <Link
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <Globe size={18} />
            </Link>
            <Link
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <Linkedin size={18} />
            </Link>
            <Link
              href="#"
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
