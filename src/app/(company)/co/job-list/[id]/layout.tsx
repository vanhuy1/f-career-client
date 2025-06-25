import type React from 'react';
import { JobHeader } from '../_components/job-header';
import { JobNavigation } from '../_components/job-navigation';

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <JobHeader />
      <JobNavigation />
      <main className="mt-8">{children}</main>
    </div>
  );
}
