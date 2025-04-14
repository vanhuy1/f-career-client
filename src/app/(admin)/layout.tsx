import React from 'react';

export const metadata = {
  title: 'Admin Site',
  description: 'Welcome to the Admin Site',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
