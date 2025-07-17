'use client';

import { useHasUpdated } from '@/hooks/use-hasUpdated';
import JobCategories from '@/components/landing/job-categories';
import JobBoard from '@/components/landing/job-board';
import JobBoardS from '@/components/landing/job-boards';
import { HeroSection } from '@/components/landing/hero-section';
import WarningProfileUpdated from '@/components/landing/warning-profile-updated';

export default function Home() {
  const { hasUpdated, loading } = useHasUpdated();

  return (
    <>
      {!loading && hasUpdated === false && <WarningProfileUpdated />}
      <HeroSection />
      <JobCategories />
      <JobBoard />
      <JobBoardS />
    </>
  );
}
