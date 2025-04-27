'use client';

import React, { useState } from 'react';
import Sidebar from './_components/sidebar';
import Header from './_components/header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-background flex h-screen">
      {/* Sidebar - Hidden on mobile by default, toggled via Header */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r bg-white transition-transform duration-300 md:static md:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
