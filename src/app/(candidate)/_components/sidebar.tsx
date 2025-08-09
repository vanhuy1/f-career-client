'use client';

import type React from 'react';
import {
  Home,
  MessageSquare,
  FileText,
  User,
  Settings,
  LogOut,
  FileUser,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Import usePathname
import ROUTES from '@/constants/navigation';
import { clearUser, useUser } from '@/services/state/userSlice';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';

export default function Sidebar() {
  const pathname = usePathname(); // Get the current pathname
  const user = useUser();

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    // Clear localStorage and cookies manually
    localStorage.clear();
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    dispatch(clearUser());

    window.location.href = ROUTES.HOMEPAGE.path;
  };
  return (
    <div className="flex w-60 flex-col border-r bg-white">
      <div className="p-6">
        <Link href={ROUTES.HOMEPAGE.path} className="flex items-center gap-2">
          <div className="rounded-full bg-blue-600 p-1.5 text-white">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">FCareerConnect</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <NavItem
            href={ROUTES.CA.HOME.path}
            icon={<Home />}
            label="Dashboard"
            active={pathname === ROUTES.CA.HOME.path}
          />
          <NavItem
            href={ROUTES.CA.HOME.MESSAGE.path}
            icon={<MessageSquare />}
            label="Messages"
            // badge={1}
            active={pathname === ROUTES.CA.HOME.MESSAGE.path}
          />
          <NavItem
            href={ROUTES.CA.HOME.APPLICATIONLIST.path}
            icon={<FileText />}
            label="My Applications"
            active={pathname === ROUTES.CA.HOME.APPLICATIONLIST.path}
          />
          <NavItem
            href={ROUTES.CA.HOME.SCHEDULE.path}
            icon={<Calendar />}
            label="Schedule"
            active={pathname === ROUTES.CA.HOME.SCHEDULE.path}
          />
          {/* <NavItem
            href={ROUTES.CA.HOME.FINDJOB.path}
            icon={<Search />}
            label="Find Jobs"
            active={pathname === ROUTES.CA.HOME.FINDJOB.path}
          />
          <NavItem
            href={ROUTES.CA.HOME.BROWSECOMPANY.path}
            icon={<Building2 />}
            label="Browse Companies"
            active={pathname === ROUTES.CA.HOME.BROWSECOMPANY.path}
          /> */}
          <NavItem
            href={ROUTES.CA.HOME.PROFILE.path}
            icon={<User />}
            label="My Public Profile"
            active={pathname === ROUTES.CA.HOME.PROFILE.path}
          />
          <NavItem
            href={ROUTES.CA.HOME.CV.path}
            icon={<FileUser />}
            label="My CV"
            active={pathname === ROUTES.CA.HOME.CV.path}
          />
        </ul>

        <div className="mt-8">
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider">
            SETTINGS
          </h3>
          <ul className="space-y-1">
            <NavItem
              href={ROUTES.CA.HOME.SETTINGS.path}
              icon={<Settings />}
              label="Settings"
              active={pathname === ROUTES.CA.HOME.SETTINGS.path}
            />
          </ul>
        </div>
      </nav>

      <div className="border-t p-4">
        <Button
          onClick={handleLogout}
          className="mb-4 flex w-full items-center justify-start gap-3 rounded-md bg-white px-3 text-red-500 hover:bg-gray-100 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src="/logo-landing/maze.png"
              alt="Jake Gyll"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-medium">{user?.data.name}</h4>
            <p className="text-muted-foreground truncate text-xs">
              {user?.data.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
}

function NavItem({ href, icon, label, badge, active }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-md px-3 py-2 ${
          active
            ? 'bg-blue-50 text-blue-600'
            : 'text-muted-foreground hover:bg-gray-100'
        }`}
      >
        <span className="h-5 w-5">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
