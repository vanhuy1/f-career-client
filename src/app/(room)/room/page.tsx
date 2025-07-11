'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Metadata is defined in layout.tsx

const StudyRoom = dynamic(() => import('@/app/(room)/room/_components/StudyRoom'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="animate-pulse text-2xl text-white filter-green-glow">Loading Study Room...</div>
    </div>
  )
});

export default function RoomPage() {
  const [isMobileView, setIsMobileView] = useState(false);

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
      <div className={cn(
        "fixed inset-0 z-50 bg-black/70 flex items-center justify-center backdrop-blur-md"
      )}>
        <img
          src="/responesive.png"
          alt="mobile"
          className="w-1/2 h-auto rounded-md"
        />
      </div>
    );
  }

  return <StudyRoom />;
} 