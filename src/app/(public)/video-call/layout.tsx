'use client'
import { MeetProvider } from './contexts/MeetContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MeetProvider>
      {children}
    </MeetProvider>
  );
}