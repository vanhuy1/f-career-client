'use client';
import ReduxProvider from '@/providers/ReduxProvider';
import { AuthProvider } from './AuthProvider';
import { ToastWrapper } from '@/providers/ToastWrapper';

const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ToastWrapper>
      <ReduxProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </ToastWrapper>
  );
};

export default MainProvider;
