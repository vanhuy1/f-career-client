'use client';
import { ProfileHeader } from '@/app/(candidate)/_components/profile/profile-header';
import { AboutSection } from '../../_components/profile/about-section';
import { ExperienceSection } from '../../_components/profile/experience-section';
import { EducationSection } from '../../_components/profile/education-section';
import { SkillsSection } from '../../_components/profile/skills-section';
import { PortfolioSection } from '../../_components/profile/portfolio-section';
import { ContactSection } from '../../_components/profile/contact-section';
// import { SocialSection } from '../../_components/profile/social-section';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  setCaProfileStart,
  setCaProfileSuccess,
  useCaProfile,
  useCaProfileErrors,
  useCaProfileLoading,
} from '@/services/state/caProfileSlice';
import { LoadingState } from '@/store/store.model';
import { candidateProfileService } from '@/services/api/profile/ca-api';
import CaProfileSkeleton from '../../_components/profile/profile-skeleton/ca-profile-skeleton';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const isLoading = useCaProfileLoading();
  const error = useCaProfileErrors();
  const profile = useCaProfile();

  useEffect(() => {
    if (!profile) {
      const fetchData = async () => {
        try {
          dispatch(setCaProfileStart());
          const profile = await candidateProfileService.getCandidateProfile();
          dispatch(setCaProfileSuccess(profile));
        } catch (error) {
          console.error('Error fetching candidate profile:', error);
        }
      };

      fetchData();
    }
  }, [dispatch, profile]);

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

  if (isLoading === LoadingState.loading) {
    return (
      <div className="flex min-h-screen w-full justify-center">
        <main className="w-[95%] origin-top scale-100 p-[2%]">
          <CaProfileSkeleton />
        </main>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="flex min-h-screen w-full justify-center">
        <main className="w-[95%] origin-top scale-100 p-[2%]">
          <div className="mb-[3%]">
            <ProfileHeader profile={profile} />
          </div>

          <div className="grid grid-cols-1 gap-[3%] md:grid-cols-3">
            <div className="space-y-[3%] md:col-span-2">
              <AboutSection about={profile.about} />
              <ExperienceSection experiences={profile.experiences} />
              <EducationSection
                education={profile.education}
                showMoreCount={2}
              />
              <SkillsSection skills={profile.skills} />
              <PortfolioSection portfolios={profile.portfolios} />
            </div>

            <div className="space-y-[3%] md:col-span-1">
              <ContactSection
                email={profile.contact?.email}
                phone={profile.contact?.phone}
                languages={profile.contact?.languages}
              />
              {/* <SocialSection
                instagram={profile.social?.instagram}
                twitter={profile.social?.twitter}
                website={profile.social?.website}
              /> */}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
