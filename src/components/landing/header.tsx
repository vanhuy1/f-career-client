'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
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

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useUser();
  const userLoading = useUserLoading();
  const authLoading = useAuthLoading();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearUser());
  };

  if ((userLoading && authLoading) === LoadingState.loading)
    return <>Loading...</>;

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
          {user && (
            <Link
              href={
                user?.data.roles[0] === ROLES.USER
                  ? ROUTES.CA.HOME.path
                  : ROUTES.CO.HOME.path
              }
              className={`transition hover:text-gray-300 ${
                pathname ===
                (user?.data.roles[0] === ROLES.USER
                  ? ROUTES.CA.HOME.path
                  : ROUTES.CO.HOME.path)
                  ? 'font-bold text-blue-500'
                  : ''
              }`}
            >
              {user?.data.roles[0] === ROLES.USER
                ? ROUTES.CA.HOME.name
                : ROUTES.CO.HOME.name}
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        {user ? (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/logo-landing/udacity.png"
                    alt={user.data.name}
                  />
                  <AvatarFallback>
                    {user.data.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user.data.name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.data.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.CA.HOME.PROFILE.path}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.CA.HOME.SETTINGS.path}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
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
        )}
      </div>
    </header>
  );
}
