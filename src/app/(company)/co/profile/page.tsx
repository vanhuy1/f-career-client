'use client';

import { useEffect, useState, useCallback } from 'react';
import { Company, CreateCompanyReq } from '@/types/Company';
import { companyService } from '@/services/api/company/company-api';
import { toast } from 'react-toastify';
import CompanyHeaderSection from './_components/company-header-section';
import CompanyProfileSection from './_components/company-profile-section';
import ContactSection from './_components/contact-section';
import WorkingAtNomadSection from './_components/working-at-section';
import OfficeLocationsSection from './_components/office-locations-section';
import TeamSection from './_components/team-section';
import OpenPositionsSection from './_components/open-positions-section';
import MapSection from './_components/map-section';
import { useUser } from '@/services/state/userSlice';

// Main component
const CompanyProfilePage = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  // Fetch company data
  const fetchCompanyData = useCallback(async () => {
    if (!user?.data?.companyId) {
      setIsLoading(false);
      return;
    }

    setError(null);

    try {
      const data = await companyService.findOne(user.data.companyId as string);
      setCompany(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load company data';
      setError(errorMessage);
      console.error('Failed to fetch company data:', err);
      toast.error('Failed to load company data. Please try again.', {
        toastId: 'company-data-error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.data?.companyId]);

  const updateCompanyData = useCallback(
    async (updatedData: Partial<CreateCompanyReq>) => {
      if (!company) {
        toast.error('No company data available to update', {
          toastId: 'company-update-error',
        });
        return;
      }

      try {
        await companyService.update(company.id, updatedData);
        await fetchCompanyData();
        toast.success('Company information updated successfully', {
          toastId: 'company-update-success',
        });
      } catch (err) {
        console.error('Failed to update company data:', err);
        toast.error('Failed to update company information', {
          toastId: 'company-update-fail',
        });
        throw err;
      }
    },
    [company, fetchCompanyData],
  );

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-red-50 p-6 text-red-600">
          Error loading profile: {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">No company data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Company Header */}
        <CompanyHeaderSection
          company={company}
          onUpdateCompany={updateCompanyData}
        />

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-8 lg:col-span-2">
            <CompanyProfileSection
              company={company}
              onUpdateCompany={updateCompanyData}
            />
            <WorkingAtNomadSection workImageUrl={company.workImageUrl} />
            <TeamSection company={company} />
            <MapSection company={company} />
            <OpenPositionsSection companyJob={company.openPositions || []} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <ContactSection
              company={company}
              onUpdateCompany={updateCompanyData}
            />
            <OfficeLocationsSection
              company={company}
              onUpdateCompany={updateCompanyData}
              address={company.address || []}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfilePage;
