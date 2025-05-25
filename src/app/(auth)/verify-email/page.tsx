'use client';
import VerifyEmailClient from '@/app/(auth)/_components/VerifyEmail';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const renderInvalidLink = useCallback(() => {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-lg">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Invalid Verification Link
          </h1>
          <p className="text-center text-gray-600">
            The verification link is invalid or has expired. Please request a
            new verification email.
          </p>
        </div>
      </div>
    );
  }, []);

  const verificationComponent = useMemo(() => {
    if (!token) {
      return renderInvalidLink();
    }
    return <VerifyEmailClient token={token} />;
  }, [token, renderInvalidLink]);

  return verificationComponent;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
