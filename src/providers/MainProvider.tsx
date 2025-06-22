'use client';
import ReduxProvider from '@/providers/ReduxProvider';
import { AuthProvider } from './AuthProvider';
import { ToastWrapper } from '@/providers/ToastWrapper';
import { Suspense } from 'react';
import LoadingScreen from '@/pages/LoadingScreen';

const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ToastWrapper>
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </ToastWrapper>
    </Suspense>
  );
};

export default MainProvider;
