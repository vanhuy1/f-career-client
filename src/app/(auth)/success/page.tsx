'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginSuccess, loginFailure } from '@/services/state/authSlice';
import {
  setUserStart,
  setUserSuccess,
  setUserFailure,
} from '@/services/state/userSlice';
import { userService } from '@/services/api/auth/user-api';
import { AuthResponse } from '@/types/Auth';
import { ROLES } from '@/enums/roles.enum';
import ROUTES from '@/constants/navigation';
import LoadingScreen from '@/pages/LoadingScreen';
import { toast } from 'react-toastify';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleAuthSuccess = async () => {
      try {
        // If user is already authenticated, redirect to homepage
        if (user) {
          router.push(ROUTES.HOMEPAGE.path);
          return;
        }

        // Extract token from URL parameters
        const token = searchParams?.get('token');

        if (!token) {
          toast.error('No authentication token received');
          router.push(ROUTES.AUTH.SIGNIN.path);
          return;
        }

        // Create auth response object matching the expected format
        // For Google OAuth, we'll use the token as both access and refresh token
        // The backend should ideally provide both, but we'll work with what we have
        const authResponse: AuthResponse = {
          data: {
            accessToken: token,
            refreshToken: token, // Use same token for now, backend should provide separate refresh token
          },
          meta: {
            message: 'Google authentication successful',
            statusCode: 200,
          },
        };

        // Store the token using existing auth actions
        dispatch(loginSuccess(authResponse));

        // Fetch user data
        dispatch(setUserStart());
        const userData = await userService.getMe();

        if (userData) {
          dispatch(setUserSuccess(userData));

          // Redirect based on user role
          if (userData.data.roles[0] === ROLES.ADMIN) {
            router.push(ROUTES.ADMIN.Home.path);
          } else {
            router.push(ROUTES.HOMEPAGE.path);
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Google auth error:', error);
        dispatch(loginFailure(error as string));
        dispatch(setUserFailure(error as string));
        toast.error('Authentication failed. Please try again.');
        router.push(ROUTES.AUTH.SIGNIN.path);
      } finally {
        setIsProcessing(false);
      }
    };

    // Only run if we're processing and don't have a user yet
    if (isProcessing && !user) {
      handleGoogleAuthSuccess();
    }
  }, [searchParams, dispatch, router, user, isProcessing]);

  if (isProcessing) {
    return <LoadingScreen />;
  }

  // This should rarely be seen as we redirect immediately
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  );
}
