import { Metadata } from 'next';
import JobDetailPageComponent from '@/app/(public)/_components/job-detail-page';

interface JobDetailPageProps {
  params: {
    slug: string;
    title: string;
  };
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug, title } = params;
  const company = slug.replace(/-/g, ' ');
  const jobTitle = title.replace(/-/g, ' ');
  const formattedCompany = company
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const formattedTitle = jobTitle
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} at ${formattedCompany}`,
    description: `Apply for the ${formattedTitle} position at ${formattedCompany}`,
  };
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  return <JobDetailPageComponent params={Promise.resolve(params)} />;
}
