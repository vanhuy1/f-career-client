'use client';

import CompanyProfileSection from './_components/company-profile-section';
import ContactSection from './_components/contact-section';
import WorkingAtNomadSection from './_components/working-at-section';
import TechStackSection from './_components/tech-stack-section';
import OfficeLocationsSection from './_components/office-locations-section';
import TeamSection from './_components/team-section';
import BenefitsSection from './_components/benefits-section';
import OpenPositionsSection from './_components/open-positions-section';
import CompanyHeaderSection from './_components/company-header-section';

const CompanyProfilePage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Content Area with Scroll */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-full sm:max-w-5xl">
            {/* Company Header */}
            <CompanyHeaderSection />

            {/* Grid Layout */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-10 sm:gap-8">
              {/* Main Column (Stacked on mobile) */}
              <div className="col-span-1 space-y-8 sm:col-span-7">
                <CompanyProfileSection />
                <ContactSection />
                <WorkingAtNomadSection />
                <TeamSection />
                <BenefitsSection />
                <OpenPositionsSection />
              </div>

              {/* Sidebar Column (Stacked below on mobile) */}
              <div className="col-span-1 space-y-8 sm:col-span-3">
                <TechStackSection />
                <OfficeLocationsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
