'use client';

import Link from 'next/link';
import { CheckCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/navigation';
import { usePathname } from 'next/navigation';
import { clearUser, useUser, useUserLoading } from '@/services/state/userSlice';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAppDispatch } from '@/store/hooks';
import { logout, useAuthLoading } from '@/services/state/authSlice';
import { LoadingState } from '@/store/store.model';
import { useState } from 'react';
import { ROLES } from '@/enums/roles.enum';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useUser();
  const userLoading = useUserLoading();
  const authLoading = useAuthLoading();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearUser());
  };

  if ((userLoading && authLoading) === LoadingState.loading)
    return (
      <header className="border-b border-gray-200 bg-[#f8f8fd]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex animate-pulse items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              <div className="h-6 w-32 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </header>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-[#f8f8fd] backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={ROUTES.HOMEPAGE.path}
            className="group flex items-center gap-3"
          >
            <div className="relative">
              <div className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 p-2 shadow-lg transition-all duration-200 group-hover:shadow-xl">
                <CheckCircle size={20} color="white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-800">
                FCareerConnect
              </span>
              <span className="-mt-1 text-xs text-gray-500">
                Find Your Dream Job
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href={ROUTES.HOMEPAGE.JOB.path}
              className={`relative rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                pathname === ROUTES.HOMEPAGE.JOB.path
                  ? 'bg-[#5e5cff]/10 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
              }`}
            >
              {ROUTES.HOMEPAGE.JOB.name}
              {pathname === ROUTES.HOMEPAGE.JOB.path && (
                <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-blue-700"></div>
              )}
            </Link>
            <Link
              href={ROUTES.HOMEPAGE.COMPANY.path}
              className={`relative rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                pathname === ROUTES.HOMEPAGE.COMPANY.path
                  ? 'bg-[#5e5cff]/10 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
              }`}
            >
              {ROUTES.HOMEPAGE.COMPANY.name}
              {pathname === ROUTES.HOMEPAGE.COMPANY.path && (
                <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-blue-700"></div>
              )}
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-transparent transition-all hover:ring-[#5e5cff]/20"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src="/logo-landing/udacity.png"
                        alt={user.data.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-700 to-blue-900 font-semibold text-white">
                        {user.data.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -right-1 -bottom-1">
                      <div className="h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="p-3 font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src="/logo-landing/udacity.png"
                            alt={user.data.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                            {user.data.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.data.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.data.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {user?.data.roles[0] === ROLES.USER
                          ? 'Job Seeker'
                          : 'Employer'}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    {user.data.roles[0] === ROLES.USER ? (
                      <Link
                        href={ROUTES.CA.HOME.PROFILE.path}
                        className="flex items-center gap-2 p-2"
                      >
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-blue-100">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                        Profile
                      </Link>
                    ) : (
                      <Link
                        href={ROUTES.CO.HOME.PROFILE.path}
                        className="flex items-center gap-2 p-2"
                      >
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-blue-100">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                        Profile
                      </Link>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    {user.data.roles[0] === ROLES.USER ? (
                      <Link
                        href={ROUTES.CA.HOME.SETTINGS.path}
                        className="flex items-center gap-2 p-2"
                      >
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-gray-100">
                          <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                        </div>
                        Settings
                      </Link>
                    ) : (
                      <Link
                        href={ROUTES.CO.HOME.SETTINGS.path}
                        className="flex items-center gap-2 p-2"
                      >
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-gray-100">
                          <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                        </div>
                        Settings
                      </Link>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    {user && (
                      <Link
                        href={
                          user?.data.roles[0] === ROLES.USER
                            ? ROUTES.CA.HOME.path
                            : ROUTES.CO.HOME.path
                        }
                        className="flex items-center gap-2 p-2"
                      >
                        <div className="flex h-4 w-4 items-center justify-center rounded bg-purple-100">
                          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                        </div>
                        {user?.data.roles[0] === ROLES.USER
                          ? ROUTES.CA.HOME.name
                          : ROUTES.CO.HOME.name}
                      </Link>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="cursor-pointer p-2 text-red-600 focus:text-red-600"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded bg-red-100">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      </div>
                      Log out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={ROUTES.AUTH.SIGNIN.path}
                  className="rounded-lg px-4 py-2 font-medium text-blue-800 transition-colors hover:bg-[#5e5cff]/5 hover:text-blue-900"
                >
                  {ROUTES.AUTH.SIGNIN.name}
                </Link>
                <Link href={ROUTES.AUTH.SIGNUP.path}>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-900 hover:shadow-xl">
                    {ROUTES.AUTH.SIGNUP.name}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200/50 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <Link
                href={ROUTES.HOMEPAGE.JOB.path}
                className={`rounded-lg px-4 py-3 font-medium transition-all ${
                  pathname === ROUTES.HOMEPAGE.JOB.path
                    ? 'bg-[#5e5cff]/10 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {ROUTES.HOMEPAGE.JOB.name}
              </Link>
              <Link
                href={ROUTES.HOMEPAGE.COMPANY.path}
                className={`rounded-lg px-4 py-3 font-medium transition-all ${
                  pathname === ROUTES.HOMEPAGE.COMPANY.path
                    ? 'bg-[#5e5cff]/10 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {ROUTES.HOMEPAGE.COMPANY.name}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
