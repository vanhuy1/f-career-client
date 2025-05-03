'use client';

import React from 'react';
import {
  Home,
  MessageSquare,
  FileText,
  Calendar,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ROUTES from '@/constants/navigation';
import { clearUser, useUser } from '@/services/state/userSlice';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/services/state/authSlice';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useUser();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    onClose(); // Close sidebar on logout
  };

  return (
    <div className="flex h-full w-full flex-col border-r bg-white">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6">
        <Link href={ROUTES.HOMEPAGE.path} className="flex items-center gap-2">
          <div className="rounded-full bg-indigo-600 p-1.5 text-white">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">FCareerConnect</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <NavItem
            href={ROUTES.CO.HOME.path}
            icon={<Home />}
            label="Dashboard"
            active={pathname === ROUTES.CO.HOME.path}
            onClick={onClose}
          />
          <NavItem
            href={ROUTES.CO.HOME.APPLICANTLIST.path}
            icon={<FileText />}
            label="Applicant List"
            active={pathname === ROUTES.CO.HOME.APPLICANTLIST.path}
            onClick={onClose}
          />
          <NavItem
            href={ROUTES.CO.HOME.JOBLIST.path}
            icon={<FileText />}
            label="Job List"
            active={pathname === ROUTES.CO.HOME.JOBLIST.path}
            onClick={onClose}
          />
          <NavItem
            href={ROUTES.CO.HOME.MESSAGE.path}
            icon={<MessageSquare />}
            label="Messages"
            active={pathname === ROUTES.CO.HOME.MESSAGE.path}
            onClick={onClose}
          />
          <NavItem
            href={ROUTES.CO.HOME.SCHEDULE.path}
            icon={<Calendar />}
            label="Schedule"
            active={pathname === ROUTES.CO.HOME.SCHEDULE.path}
            onClick={onClose}
          />
          <NavItem
            href={ROUTES.CO.HOME.PROFILE.path}
            icon={<User />}
            label="Profile"
            active={pathname === ROUTES.CO.HOME.PROFILE.path}
            onClick={onClose}
          />
        </ul>

        <div className="mt-8">
          <h3 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider">
            SETTINGS
          </h3>
          <ul className="space-y-1">
            <NavItem
              href={ROUTES.CO.HOME.SETTINGS.path}
              icon={<Settings />}
              label="Settings"
              active={pathname === ROUTES.CO.HOME.SETTINGS.path}
              onClick={onClose}
            />
          </ul>
        </div>
      </nav>

      {/* User Info and Logout */}
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
              alt="User Avatar"
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
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, active, onClick }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 rounded-md px-3 py-2 ${
          active
            ? 'bg-indigo-50 text-indigo-600'
            : 'text-muted-foreground hover:bg-gray-100'
        }`}
      >
        <span className="h-5 w-5">{icon}</span>
        <span className="flex-1">{label}</span>
      </Link>
    </li>
  );
}
