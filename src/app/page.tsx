import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import CompaniesSection from "@/components/landing/conpanies-section";
import JobCategories from "@/components/landing/job-categories";
import JobPostingHero from "@/components/landing/job-posting-hero";
import JobBoard from "@/components/landing/job-board";
import JobBoardS from "@/components/landing/job-boards";

export default function Home() {
  return (
    <>
      <Header />
      <CompaniesSection />
      <JobCategories />
      <JobPostingHero />
      <JobBoard />
      <JobBoardS />
      <Footer />
    </>
  );
}
