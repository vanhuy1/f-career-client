import React from 'react';
import Sidebar from './_components/sidebar';
import Header from './_components/header';

export const metadata = {
  title: 'Company Site',
  description: 'Welcome to the Company Site',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-background flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          {children}
        </div>
      </div>
    </>
  );
}
