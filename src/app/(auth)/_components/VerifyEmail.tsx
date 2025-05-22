'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from './Logo';
import { authService } from '@/services/api/auth/auth-api';

interface VerifyEmailProps {
  token: string;
}

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function VerifyEmailClient({ token }: VerifyEmailProps) {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const [email, setEmail] = useState<string>('');

  const verifyEmail = useCallback(async (verificationToken: string) => {
    if (!verificationToken) {
      setStatus('error');
      setMessage(
        'Invalid verification link. Please request a new verification email.',
      );
      return;
    }

    try {
      setStatus('loading');
      setMessage('Verifying your email address...');
      
      const response = await authService.verifyEmail(verificationToken);

      if (response.success) {
        setStatus('success');
        setMessage(
          response.message || 'Your email has been successfully verified!',
        );
      } else {
        // Check if the token is expired
        if (response.message?.toLowerCase().includes('expired')) {
          setStatus('expired');
          setMessage('Your verification link has expired.');
        } else {
          setStatus('error');
          setMessage(
            response.message || 'There was an error verifying your email.',
          );
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage(
        'There was an error connecting to the server. Please try again later.',
      );
    }
  }, []);

  useEffect(() => {
    verifyEmail(token);
    
    // Try to extract email from token if needed for resend functionality
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length > 1) {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.email) {
          setEmail(payload.email);
        }
      }
    } catch {
      // Silent fail if we can't extract email from token
    }
  }, [token, verifyEmail]);

  const handleContinue = () => {
    router.push('/signin');
  };

  const handleTryAgain = useCallback(() => {
    verifyEmail(token);
  }, [token, verifyEmail]);

  const handleResendVerification = async () => {
    setStatus('loading');
    setMessage('Requesting a new verification email...');

    try {
      // Use the email extracted from token or pass the token itself
      const payload = email ? { email } : { token };
      
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(
          'A new verification email has been sent. Please check your inbox.',
        );
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send a new verification email.');
      }
    } catch {
      setStatus('error');
      setMessage(
        'There was an error connecting to the server. Please try again later.',
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              Email Verification
            </CardTitle>
            <CardDescription className="text-center">
              {status === 'loading'
                ? 'Please wait while we verify your email'
                : status === 'success'
                  ? 'Your account is now activated'
                  : status === 'expired'
                    ? 'Verification link expired'
                    : 'We encountered an issue'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 pt-6 pb-8">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                <p className="text-center text-gray-600">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-center text-gray-600">{message}</p>
                <p className="text-center text-gray-600">
                  You can now access all features of FCareerConnect and start
                  exploring job opportunities.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-center text-gray-600">{message}</p>
              </div>
            )}

            {status === 'expired' && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-16 w-16 text-amber-500" />
                <p className="text-center text-gray-600">{message}</p>
                <p className="text-center text-gray-600">
                  Verification links are valid for 24 hours. You can request a
                  new verification email.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {status === 'success' && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleContinue}
              >
                Continue to Sign In
              </Button>
            )}

            {status === 'error' && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleTryAgain}
              >
                Try Again
              </Button>
            )}

            {status === 'expired' && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </Button>
            )}

            {status === 'loading' && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                Verifying...
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
