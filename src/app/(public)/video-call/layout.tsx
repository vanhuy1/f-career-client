'use client'
import { MeetProvider } from './contexts/MeetContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MeetProvider>
          {children}
        </MeetProvider>
      </body>
    </html>
  );
}