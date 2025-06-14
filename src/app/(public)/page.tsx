import JobCategories from '@/components/landing/job-categories';
import JobBoard from '@/components/landing/job-board';
import JobBoardS from '@/components/landing/job-boards';
import { HeroSection } from '@/components/landing/hero-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <JobCategories />
      <JobBoard />
      <JobBoardS />
    </>
  );
}
