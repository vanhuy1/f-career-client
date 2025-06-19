import type React from 'react';
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/(admin)/_components/sidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage companies and users efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50/50">{children}</main>
      </div>
    </SidebarProvider>
  );
}
