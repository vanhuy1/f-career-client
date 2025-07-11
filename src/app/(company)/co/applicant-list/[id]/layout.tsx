'use client';

import type React from 'react';

import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { applicationService } from '@/services/api/applications/application-api';
import {
  setApplicantDetailStart,
  setApplicantDetailSuccess,
  setApplicantDetailFailure,
  useApplicantDetail,
  useApplicantDetailLoadingState,
  clearApplicantDetail,
} from '@/services/state/applicantDetailSlice';
import { useDispatch } from 'react-redux';
import { LoadingState } from '@/store/store.model';
import LoadingScreen from '@/pages/LoadingScreen';

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const applicantId = params?.id as string;
  const applicant = useApplicantDetail();
  const loadingState = useApplicantDetailLoadingState();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearApplicantDetail());
    };
  }, [dispatch]);

  // MODIFIED: Simplified data fetching
  useEffect(() => {
    if (!applicantId) return;

    // Only fetch data if applicant is null
    if (!applicant) {
      const fetchApplicantData = async () => {
        try {
          dispatch(setApplicantDetailStart());
          const response =
            await applicationService.getApplicantDetail(applicantId);
          if (response) {
            dispatch(setApplicantDetailSuccess(response));
          }
        } catch (error) {
          dispatch(setApplicantDetailFailure(error as string));
        }
      };

      fetchApplicantData();
    }
  }, [applicantId, dispatch, applicant]);

  const tabs = [
    { name: 'Profile', href: `/co/applicant-list/${applicantId}` },
    { name: 'Resume', href: `/co/applicant-list/${applicantId}/resume` },
    {
      name: 'Progress',
      href: `/co/applicant-list/${applicantId}/hiring-progress`,
    },
    {
      name: 'Schedule',
      href: `/co/applicant-list/${applicantId}/interview-schedule`,
    },
    {
      name: 'AI Analysis',
      href: `/co/applicant-list/${applicantId}/ai-analysis`,
    },
  ];

  // Loading state
  if (loadingState === LoadingState.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200/60 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/co/applicant-list">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 hover:bg-gray-100/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Applicant Details
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Review candidate information and progress
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 p-6">
        {/* Left Sidebar */}
        <div className="w-80 space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border border-gray-200/60 bg-white/90 p-6 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
            <div className="mb-6 flex items-start gap-4">
              <div className="relative">
                <Image
                  src={
                    applicant?.candidate?.avatar ||
                    '/placeholder.svg?height=80&width=80'
                  }
                  alt={applicant?.candidate?.name || 'Applicant'}
                  width={80}
                  height={80}
                  className="rounded-full object-cover shadow-md ring-4 ring-white"
                />
                <div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {applicant?.candidate?.name || 'Loading...'}
                </h2>
                <p className="font-medium text-gray-600">
                  {applicant?.candidateProfile?.title || 'Candidate'}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {applicant?.job?.location || 'Location not specified'}
                </div>
              </div>
            </div>

            {/* Applied Jobs */}
            <div className="mb-6 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Applied Position
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {applicant?.applied_at
                    ? new Date(applicant.applied_at).toLocaleDateString()
                    : 'Recently'}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {applicant?.job?.title || 'Job Title'}
                </h3>
                <p className="text-sm text-gray-600">
                  {applicant?.job?.company?.companyName || 'Company'} •{' '}
                  {applicant?.job?.typeOfEmployment || 'Employment Type'}
                </p>
              </div>
            </div>

            {/* Stage Progress */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Hiring Stage
                </span>
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  {applicant?.status || 'Pending'}
                </Badge>
              </div>
              <div className="space-y-2">
                <Progress value={75} className="h-3 bg-gray-100" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Applied</span>
                  <span>Screening</span>
                  <span className="font-medium text-blue-600">Interview</span>
                  <span>Final</span>
                </div>
              </div>
            </div>

            {/* Schedule Interview Button */}
            <Link href={`/applicants/${applicantId}/interview-schedule`}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            </Link>
          </div>

          {/* Contact Card */}
          <div className="rounded-xl border border-gray-200/60 bg-white/90 p-6 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {applicant?.candidate?.email || 'Email not available'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {applicant?.candidate?.phone || 'Phone not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-gray-200/60 bg-white/90 shadow-lg shadow-gray-100/50 backdrop-blur-sm">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200/60 bg-gray-50/50">
              <div className="flex">
                {tabs.map((tab) => {
                  const isActive = pathname === tab.href;
                  return (
                    <Link
                      key={tab.name}
                      href={tab.href}
                      className={`relative flex-1 px-6 py-4 text-center text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'border-b-2 border-blue-600 bg-white text-blue-600'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                      }`}
                    >
                      {tab.name}
                      {isActive && (
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
