'use client';
import ReduxProvider from '@/providers/ReduxProvider';
import { AuthProvider } from './AuthProvider';

const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
};

export default MainProvider;
