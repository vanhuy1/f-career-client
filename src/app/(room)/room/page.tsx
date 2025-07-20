'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
// import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Metadata is defined in layout.tsx

const StudyRoom = dynamic(
  () => import('@/app/(room)/room/_components/StudyRoom'),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="filter-green-glow animate-pulse text-2xl text-white">
          Loading Study Room...
        </div>
      </div>
    ),
  },
);

export default function RoomPage() {
  const [isMobileView, setIsMobileView] = useState(false);
  // const searchParams = useSearchParams();

  // Extract query parameters - these are kept for future reference
  // but are no longer passed to StudyRoom component
  // const activeTab = searchParams?.get('tab') || 'study';
  // const shouldGenerateRoadmap = searchParams?.get('generate') === 'true';
  // const jobId = searchParams?.get('jobId');
  // const cvId = searchParams?.get('cvId');
  // const jobTitle = searchParams?.get('jobTitle');
  // const shouldOpenRoadmap = activeTab === 'roadmap';

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isMobileView) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md',
        )}
      >
        <Image
          src="/responesive.png"
          alt="mobile"
          width={400}
          height={300}
          className="h-auto w-1/2 rounded-md"
        />
      </div>
    );
  }

  return <StudyRoom />;
}
