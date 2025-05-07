import { SkeletonAboutSection } from './about-skeleton';
import { ContactSectionSkeleton } from './contact-skeleton';
import { EducationSectionSkeleton } from './education-skeleton';
import { ExperienceSectionSkeleton } from './experience-skeleton';
import { PortfolioSectionSkeleton } from './portfolio-skeleton';
import { ProfileHeaderSkeleton } from './profile-header-skeleton';
import { SkillsSectionSkeleton } from './skill-skeleton';
import { SocialSectionSkeleton } from './social-skeleton';

export default function CaProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <ProfileHeaderSkeleton />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <SkeletonAboutSection />
          <ExperienceSectionSkeleton />
          <EducationSectionSkeleton />
          <SkillsSectionSkeleton />
          <PortfolioSectionSkeleton />
        </div>

        <div className="md:col-span-1">
          <ContactSectionSkeleton />
          <SocialSectionSkeleton />
        </div>
      </div>
    </div>
  );
}
