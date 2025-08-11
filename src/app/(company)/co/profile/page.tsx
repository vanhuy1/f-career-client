'use client';

import { useEffect, useState, useCallback } from 'react';
import { Company, CreateCompanyReq } from '@/types/Company';
import { companyService } from '@/services/api/company/company-api';
import { toast } from 'react-toastify';
import CompanyHeaderSection from './_components/company-header-section';
import CompanyProfileSection from './_components/company-profile-section';
import ContactSection from './_components/contact-section';
import WorkingAtSection from './_components/working-at-section';
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
        // toast.success('Company information updated successfully', {
        //   toastId: 'company-update-success',
        // });
      } catch (err) {
        console.error('Failed to update company data:', err);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="mx-4 max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Error Loading Company
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-indigo-400 opacity-20" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Loading company details...
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Please wait while we fetch the information
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-semibold text-gray-900">
            No Company Profile Found
          </h3>
          <p className="text-gray-600">
            Please complete your company profile to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400 opacity-10 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-400 opacity-10 mix-blend-multiply blur-xl filter"></div>
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="mb-12">
          <CompanyHeaderSection
            company={company}
            onUpdateCompany={updateCompanyData}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Column */}
          <div className="space-y-8 lg:col-span-8">
            <CompanyProfileSection
              company={company}
              onUpdateCompany={updateCompanyData}
            />
            <WorkingAtSection
              company={company}
              onUpdateCompany={updateCompanyData}
            />
            <TeamSection company={company} />
            <MapSection company={company} />
            <OpenPositionsSection companyJob={company.openPositions || []} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8 lg:col-span-4">
            <div className="sticky top-8 space-y-6">
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
        </div>
      </main>
    </div>
  );
};

export default CompanyProfilePage;
