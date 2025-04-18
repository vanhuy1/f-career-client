import React from 'react';
import Header from './_components/header';
import Sidebar from './_components/sidebar';

export const metadata = {
  title: 'Company Site',
  description: 'Welcome to the Company Site',
};

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
