'use client';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ROUTES from '@/constants/navigation';

export default function Header() {
  const pathname = usePathname();

  const getHeaderTitle = () => {
    if (pathname === ROUTES.CA.HOME.path) {
      return ROUTES.CA.HOME.name;
    } else if (pathname === ROUTES.CA.HOME.APPLICATIONLIST.path) {
      return ROUTES.CA.HOME.APPLICATIONLIST.name;
    } else if (pathname === ROUTES.CA.HOME.BROWSECOMPANY.path) {
      return ROUTES.CA.HOME.BROWSECOMPANY.name;
    } else if (pathname === ROUTES.CA.HOME.MESSAGE.path) {
      return ROUTES.CA.HOME.MESSAGE.name;
    } else if (pathname === ROUTES.CA.HOME.PROFILE.path) {
      return ROUTES.CA.HOME.PROFILE.name;
    } else if (pathname === ROUTES.CA.HOME.SETTINGS.path) {
      return ROUTES.CA.HOME.SETTINGS.name;
    } else if (pathname === ROUTES.CA.HOME.FINDJOB.path) {
      return ROUTES.CA.HOME.FINDJOB.name;
    }
    return 'Dashboard'; // Default fallback
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-2xl font-semibold">{getHeaderTitle()}</h1>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" className="text-indigo-600">
              Back to homepage
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
