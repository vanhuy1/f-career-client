import JobDetailPageComponent from '@/app/(public)/_components/job-detail-page';

interface PageProps {
  params: Promise<{
    slug: string;
    title: string;
  }>;
}

export default function JobDetailPage({ params }: PageProps) {
  return <JobDetailPageComponent params={params} />;
}
