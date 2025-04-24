import { fakeUserProfile } from '@/data/UserProfile';
import { ProfileHeader } from '@/app/(candidate)/_components/profile/profile-header';
import { AboutSection } from '../../_components/profile/about-section';
import { ExperienceSection } from '../../_components/profile/experience-section';
import { EducationSection } from '../../_components/profile/education-section';
import { SkillsSection } from '../../_components/profile/skills-section';
import { PortfolioSection } from '../../_components/profile/portfolio-section';
import { ContactSection } from '../../_components/profile/contact-section';
import { SocialSection } from '../../_components/profile/social-section';

export default function ProfilePage() {
  const profile = fakeUserProfile;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <AboutSection about={profile.about} />
          <ExperienceSection
            experiences={profile.experiences}
            showMoreCount={3}
          />
          <EducationSection education={profile.education} showMoreCount={2} />
          <SkillsSection skills={profile.skills} />
          <PortfolioSection portfolios={profile.portfolios} />
        </div>

        <div className="md:col-span-1">
          <ContactSection
            email={profile.contact.email}
            phone={profile.contact.phone}
            languages={profile.contact.languages}
          />
          <SocialSection
            instagram={profile.social.instagram}
            twitter={profile.social.twitter}
            website={profile.social.website}
          />
        </div>
      </div>
    </div>
  );
}
