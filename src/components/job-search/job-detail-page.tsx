import BreadcrumbNavigation from '@/app/(public)/_components/breadcrump-navigation';
import JobHeader from '@/components/job-search/job-header';
import JobSection from '@/components/job-search/job-section';
import CheckListItem from '@/components/job-search/job-check-list-item';
import JobDetails from '@/components/job-search/job-detail';
import JobCategories from '@/components/job-search/job-categories';
import JobSkills from '@/components/job-search/job-skill';

interface JobDetailPageProps {
  params: Promise<{
    slug: string;
    title: string;
  }>;
}

export default async function JobDetailPageComponent({
  params,
}: JobDetailPageProps) {
  const { slug, title } = await params;
  const company = slug.replace(/-/g, ' ');
  const jobTitle = title.replace(/-/g, ' ');
  const formattedCompany = company
    .split(' ')
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join(' ');
  const formattedTitle = jobTitle
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Hardcoded data for demonstration
  const location = 'Paris, France';
  const jobType = 'Full-Time';
  const applied = 5;
  const capacity = 10;
  const applyBefore = 'July 31, 2021';
  const postedOn = 'July 1, 2021';
  const salary = '$75k-$85k USD';
  const categories = ['Marketing', 'Design'];
  const skills = [
    'Project Management',
    'Copywriting',
    'Social Media Marketing',
    'English',
    'Copy Editing',
  ];

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <BreadcrumbNavigation
        company={{ companyName: formattedCompany }}
        jobTitle={{ title: formattedTitle }}
      />
      <JobHeader
        companyName={formattedCompany}
        jobTitle={formattedTitle}
        location={location}
        jobType={jobType}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <JobSection title="Description">
            <p className="leading-relaxed text-gray-600">
              {formattedCompany} is looking for Social Media Marketing expert to
              help manage our online networks. You will be responsible for
              monitoring our social media channels, creating content, finding
              effective ways to engage the community and incentivize others to
              engage on our channels.
            </p>
          </JobSection>
          <JobSection title="Responsibilities">
            <ul className="space-y-3">
              <CheckListItem>
                Community engagement to ensure that is supported and actively
                represented online
              </CheckListItem>
              <CheckListItem>
                Focus on social media content development and publication
              </CheckListItem>
              <CheckListItem>Marketing and strategy support</CheckListItem>
              <CheckListItem>
                Stay on top of trends on social media platforms, and suggest
                content ideas to the team
              </CheckListItem>
              <CheckListItem>Engage with online communities</CheckListItem>
            </ul>
          </JobSection>
          <JobSection title="Who You Are">
            <ul className="space-y-3">
              <CheckListItem>
                You get energy from people and building the ideal work
                environment
              </CheckListItem>
              <CheckListItem>
                You have a sense for beautiful spaces and office experiences
              </CheckListItem>
              <CheckListItem>
                You are a confident office manager, ready for added
                responsibilities
              </CheckListItem>
              <CheckListItem>
                You&apos;re detail-oriented and creative
              </CheckListItem>
              <CheckListItem>
                You&apos;re a growth marketer and know how to run campaigns
              </CheckListItem>
            </ul>
          </JobSection>
          <JobSection title="Nice-To-Haves">
            <ul className="space-y-3">
              <CheckListItem>Fluent in English</CheckListItem>
              <CheckListItem>Project management skills</CheckListItem>
              <CheckListItem>Copy editing skills</CheckListItem>
            </ul>
          </JobSection>
        </div>
        <div className="lg:col-span-1">
          <div className="space-y-8 rounded-lg border p-6">
            <JobDetails
              applied={applied}
              capacity={capacity}
              applyBefore={applyBefore}
              postedOn={postedOn}
              jobType={jobType}
              salary={salary}
            />
            <JobCategories categories={categories} />
            <JobSkills skills={skills} />
          </div>
        </div>
      </div>
    </div>
  );
}
