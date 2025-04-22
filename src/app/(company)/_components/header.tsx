'use client';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/navigation';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-2xl font-semibold">Company Name</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Link href={ROUTES.HOMEPAGE.path}>
            <Button variant="outline" className="text-indigo-600">
              Post Job
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
