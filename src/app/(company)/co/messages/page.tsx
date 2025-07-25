'use client';

import dynamic from 'next/dynamic';

// Import the component dynamically with SSR disabled
const MessagesPageComponent = dynamic(() => import('@/pages/MessagesPage'), {
  ssr: false,
});

export default function CompanyMessagesPage() {
  return <MessagesPageComponent />;
}
