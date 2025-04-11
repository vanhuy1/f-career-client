import React from 'react';

export const metadata = {
  title: 'Company Site',
  description: 'Welcome to the Company Site',
};

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
