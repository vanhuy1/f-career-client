'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useApplicantDetail } from '@/services/state/applicantDetailSlice';
import { createSafeHtml } from '@/utils/html-sanitizer';

export default function ApplicantProfilePage() {
  const applicant = useApplicantDetail();
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Applicant Profile</h2>
        {applicant?.candidate?.id && (
          <Link href={`/co/candidate/${applicant.candidateProfile.id}`}>
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              View Full Profile
            </Button>
          </Link>
        )}
      </div>
      <div className="mb-8">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Personal Info
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {applicant?.candidate.name}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {applicant?.candidate.gender}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Date of Birth</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {/* {applicant?.candidateProfile.birthDate}<span className="text-gray-500">(26 y.o)</span> */}
              {applicant?.candidateProfile.birthDate}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Language</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              English, French, Bahasa
            </p>
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600">Address</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {applicant?.candidateProfile?.location}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Professional Info
        </h3>

        <div className="mb-6">
          <label className="text-sm text-gray-600">About Me</label>
          {applicant?.candidateProfile?.about && (
            <div
              className="prose mt-2 max-w-none text-sm leading-relaxed text-gray-900"
              dangerouslySetInnerHTML={createSafeHtml(
                applicant.candidateProfile.about,
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Current Job</label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {applicant?.candidateProfile?.title}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Experience in Years</label>
            <p className="mt-1 text-sm font-medium text-gray-900">4 Years</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">
              Highest Qualification Held
            </label>
            <p className="mt-1 text-sm font-medium text-gray-900">
              Bachelors in Engineering
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Skill set</label>
            <div className="mt-2 flex gap-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Project Management
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Copywriting
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                English
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
