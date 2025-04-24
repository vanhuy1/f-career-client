'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'My Profile', href: '/ca/settings' },
    { name: 'Login Details', href: '/ca/settings/auth' },
    { name: 'Notifications', href: '/ca/settings/noti' },
  ];
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <nav className="border-b border-gray-200">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'inline-flex items-center pb-4 text-sm font-medium',
                  isActive
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:border-gray-300 hover:text-gray-700',
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      {children}
    </div>
  );
}
