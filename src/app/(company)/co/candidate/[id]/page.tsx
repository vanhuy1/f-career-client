'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProfileHeader } from '@/app/(candidate)/_components/profile/profile-header';
import { AboutSection } from '@/app/(candidate)/_components/profile/about-section';
import { ExperienceSection } from '@/app/(candidate)/_components/profile/experience-section';
import { EducationSection } from '@/app/(candidate)/_components/profile/education-section';
import { SkillsSection } from '@/app/(candidate)/_components/profile/skills-section';
import { ContactSection } from '@/app/(candidate)/_components/profile/contact-section';
import { candidateProfileService } from '@/services/api/profile/ca-api';
import { CandidateProfile } from '@/types/CandidateProfile';
import CaProfileSkeleton from '@/app/(candidate)/_components/profile/profile-skeleton/ca-profile-skeleton';

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const candidateId = params?.id as string;

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      if (!candidateId) return;

      try {
        setIsLoading(true);
        setError(null);
        const candidateProfile =
          await candidateProfileService.getCandidateProfileById(candidateId);
        setProfile(candidateProfile);
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        setError('Failed to load candidate profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateProfile();
  }, [candidateId]);

  if (error) {
    return (
      <div className="flex min-h-screen w-full justify-center">
        <main className="w-[95%] origin-top scale-100 p-[2%]">
          <div className="rounded-lg border border-red-200 bg-red-50 p-[2%]">
            <h2 className="mb-[1%] text-[calc(1.25rem+0.3vw)] font-semibold text-red-800">
              Error Loading Profile
            </h2>
            <p className="text-[calc(0.875rem+0.1vw)] text-red-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full justify-center">
        <main className="w-[95%] origin-top scale-100 p-[2%]">
          <CaProfileSkeleton />
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen w-full justify-center">
        <main className="w-[95%] origin-top scale-100 p-[2%]">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-[2%]">
            <h2 className="mb-[1%] text-[calc(1.25rem+0.3vw)] font-semibold text-yellow-800">
              Profile Not Found
            </h2>
            <p className="text-[calc(0.875rem+0.1vw)] text-yellow-600">
              The candidate profile could not be found.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full justify-center">
      <main className="w-[95%] origin-top scale-100 p-[2%]">
        <div className="mb-[3%]">
          <ProfileHeader profile={profile} readOnly={true} />
        </div>

        <div className="grid grid-cols-1 gap-[3%] md:grid-cols-3">
          <div className="space-y-[3%] md:col-span-2">
            <AboutSection about={profile.about} readOnly={true} />
            <ExperienceSection
              experiences={profile.experiences}
              readOnly={true}
            />
            <EducationSection
              education={profile.education}
              showMoreCount={2}
              readOnly={true}
            />
            <SkillsSection skills={profile.skills} readOnly={true} />
          </div>

          <div className="space-y-[3%] md:col-span-1">
            <ContactSection
              email={profile.contact?.email}
              phone={profile.contact?.phone}
              languages={profile.contact?.languages}
              readOnly={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
