'use client';

import type React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/(admin)/_components/sidebar';
import { AdminPermission } from '@/providers/authorization/AdminPermission';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPermission>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-gray-50/50">{children}</main>
        </div>
      </SidebarProvider>
    </AdminPermission>
  );
}
