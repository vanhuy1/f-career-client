import CompaniesSection from '@/components/landing/conpanies-section';
import JobCategories from '@/components/landing/job-categories';
import JobPostingHero from '@/components/landing/job-posting-hero';
import JobBoard from '@/components/landing/job-board';
import JobBoardS from '@/components/landing/job-boards';
import { HeroSection } from '@/components/landing/hero-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CompaniesSection />
      <JobCategories />
      <JobPostingHero />
      <JobBoard />
      <JobBoardS />
    </>
  );
}
