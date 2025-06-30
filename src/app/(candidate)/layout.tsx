'use client';

import React from 'react';
import Header from './_components/header';
import Sidebar from './_components/sidebar';
import { CandidatePermission } from '@/providers/authorization/CandidatePermission';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidatePermission>
      <div className="bg-background flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          {children}
        </div>
      </div>
    </CandidatePermission>
  );
}
