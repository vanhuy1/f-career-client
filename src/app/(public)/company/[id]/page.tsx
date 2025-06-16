'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { companyService } from '@/services/api/company/company-api';
import { toast } from 'react-toastify';
import CompanyHeaderSection from './_components/company-header-section';
import CompanyProfileSection from './_components/company-profile-section';
import WorkingAtSection from './_components/working-at-section';
import OpenPositionsSection from './_components/open-positions-section';
import ContactSection from './_components/contact-section';
import OfficeLocationsSection from './_components/office-locations-section';
import TeamSection from './_components/team-section';
import MapSection from './_components/map-section';
import { useDispatch } from 'react-redux';
import {
  setCompanyDetailStart,
  setCompanyDetailSuccess,
  setCompanyDetailFailure,
  useCompanyDetailById,
  useCompanyDetailLoadingState,
  useCompanyDetailErrors,
} from '@/services/state/companySlice';
import { LoadingState } from '@/store/store.model';

// Main component
const PublicCompanyDetailPage = () => {
  const params = useParams();
  const companyId = params?.id as string;
  const dispatch = useDispatch();

  // Redux hooks
  const company = useCompanyDetailById(companyId);
  const loadingState = useCompanyDetailLoadingState();
  const error = useCompanyDetailErrors();
  const isLoading = loadingState === LoadingState.loading;

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) return;

      // Chỉ fetch data khi chưa có trong store
      if (!company) {
        dispatch(setCompanyDetailStart());
        try {
          const data = await companyService.findOne(companyId);
          dispatch(setCompanyDetailSuccess(data));
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load company data';
          dispatch(setCompanyDetailFailure(errorMessage));
          console.error('Failed to fetch company data:', err);
          toast.error('Failed to load company data. Please try again.', {
            toastId: 'company-data-error',
          });
        }
      }
    };

    fetchCompanyData();
  }, [companyId, company, dispatch]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-red-50 p-6 text-red-600">
          Error loading company: {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Company not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Company Header */}
        <CompanyHeaderSection company={company} />

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-8 lg:col-span-2">
            <CompanyProfileSection company={company} />
            <WorkingAtSection workImageUrl={company.workImageUrl} />
            <TeamSection company={company} />
            <MapSection company={company} />
            <OpenPositionsSection companyJob={company.openPositions || []} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <ContactSection company={company} />
            <OfficeLocationsSection address={company.address || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCompanyDetailPage;
