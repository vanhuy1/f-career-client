import { Metadata } from 'next';
import ReduxProvider from '@/providers/ReduxProvider';
import './styles.css';

export const metadata: Metadata = {
  title: 'F-Career Room | F-Career',
  description:
    'A virtual study room with animated backgrounds, music, and productivity tools',
};

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
