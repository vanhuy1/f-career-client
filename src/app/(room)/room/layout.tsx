'use client';

import ReduxProvider from '@/providers/ReduxProvider';
import './styles.css';
import { CandidatePermission } from '@/providers/authorization/CandidatePermission';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidatePermission>
      <ReduxProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </CandidatePermission>
  );
}
