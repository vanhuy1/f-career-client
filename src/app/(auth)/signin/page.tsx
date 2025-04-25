'use client';

import React from 'react';
import Logo from '../_components/Logo';
import { useAuthLoading } from '@/services/state/authSlice';
import { SignInForm } from '../_components/SignInForm';
import { LoadingState } from '@/store/store.model';
import LoadingScreen from '@/pages/LoadingScreen';

export default function SignInPage() {
  const authLoading = useAuthLoading();

  if (authLoading === LoadingState.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Logo />
      <SignInForm />
    </div>
  );
}
