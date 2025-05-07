'use client';
import { ProfileHeader } from '@/app/(candidate)/_components/profile/profile-header';
import { AboutSection } from '../../_components/profile/about-section';
import { ExperienceSection } from '../../_components/profile/experience-section';
import { EducationSection } from '../../_components/profile/education-section';
import { SkillsSection } from '../../_components/profile/skills-section';
import { PortfolioSection } from '../../_components/profile/portfolio-section';
import { ContactSection } from '../../_components/profile/contact-section';
import { SocialSection } from '../../_components/profile/social-section';
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
          // const profile = await candidateProfileService.getCandidateProfile();
          dispatch(setCaProfileSuccess(profile));
        } catch (error) {
          console.error('Error fetching candidate profile:', error);
        }
      };

      fetchData();
    }
  }, [dispatch, profile]); // Changed dependency to dispatch instead of profile

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  if (isLoading === LoadingState.loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <CaProfileSkeleton />;
      </div>
    );
  }

  if (profile) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <>
          <ProfileHeader profile={profile} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <AboutSection about={profile.about} />
              <ExperienceSection experiences={profile.experiences} />
              <EducationSection
                education={profile.education}
                showMoreCount={2}
              />
              <SkillsSection skills={profile.skills} />
              <PortfolioSection portfolios={profile.portfolios} />
            </div>

            <div className="md:col-span-1">
              <ContactSection
                email={profile.contact?.email}
                phone={profile.contact?.phone}
                languages={profile.contact?.languages}
              />
              <SocialSection
                instagram={profile.social?.instagram}
                twitter={profile.social?.twitter}
                website={profile.social?.website}
              />
            </div>
          </div>
        </>
      </div>
    );
  }
}
