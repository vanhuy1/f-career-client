'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/navigation';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[#1a1d29] text-white">
      {/* Navigation Bar */}
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href={ROUTES.HOMEPAGE.path} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#5e5cff] p-1.5">
                <CheckCircle size={20} color="white" />
              </div>
              <span className="text-xl font-bold">FCareerConnect</span>
            </div>
          </Link>
          <Link
            href={ROUTES.HOMEPAGE.JOB.path}
            className={`transition hover:text-gray-300 ${
              pathname === ROUTES.HOMEPAGE.JOB.path
                ? 'font-bold text-blue-500'
                : ''
            }`}
          >
            {ROUTES.HOMEPAGE.JOB.name}
          </Link>
          <Link
            href={ROUTES.HOMEPAGE.COMPANY.path}
            className={`transition hover:text-gray-300 ${
              pathname === ROUTES.HOMEPAGE.COMPANY.path
                ? 'font-bold text-blue-500'
                : ''
            }`}
          >
            {ROUTES.HOMEPAGE.COMPANY.name}
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.AUTH.SIGNIN.path}
            className="text-[#5e5cff] transition hover:text-[#4b49ff]"
          >
            {ROUTES.AUTH.SIGNIN.name}
          </Link>
          <Link href={ROUTES.AUTH.SIGNUP.path}>
            <Button className="bg-[#5e5cff] text-white hover:bg-[#4b49ff]">
              {ROUTES.AUTH.SIGNUP.name}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
