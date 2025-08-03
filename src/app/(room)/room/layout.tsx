'use client';

import ReduxProvider from '@/providers/ReduxProvider';
import './styles.css';
import { CandidatePermission } from '@/providers/authorization/CandidatePermission';

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidatePermission>
      <ReduxProvider>{children}</ReduxProvider>
    </CandidatePermission>
  );
}
