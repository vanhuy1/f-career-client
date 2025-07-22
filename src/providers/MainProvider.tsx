'use client';
import ReduxProvider from '@/providers/ReduxProvider';
import { AuthProvider } from './AuthProvider';
import { ToastWrapper } from '@/providers/ToastWrapper';
import { Suspense } from 'react';
import LoadingScreen from '@/pages/LoadingScreen';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Global error handler for the error boundary
  const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Global Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
  };

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <Suspense fallback={<LoadingScreen />}>
        <ToastWrapper>
          <ReduxProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReduxProvider>
        </ToastWrapper>
      </Suspense>
    </ErrorBoundary>
  );
};

export default MainProvider;
