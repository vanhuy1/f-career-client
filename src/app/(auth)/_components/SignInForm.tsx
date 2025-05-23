'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ROUTES from '@/constants/navigation';
import Divider from './Divider';
import GoogleSignButton from './GoogleSignButton';
import Link from 'next/link';
import { SignInRequest, signInRequestSchema } from '@/schemas/Auth';
import { authService } from '@/services/api/auth/auth-api';
import { useAppDispatch } from '@/store/hooks';
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '@/services/state/authSlice';
import { useRouter } from 'next/navigation';
import { setUserStart, setUserSuccess } from '@/services/state/userSlice';
import { userService } from '@/services/api/auth/user-api';
import { ROLES } from '@/enums/roles.enum';
import { toast } from 'react-toastify';

export const SignInForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInRequest>({
    resolver: zodResolver(signInRequestSchema),
  });

  const onSubmit = async (data: SignInRequest) => {
    try {
      dispatch(loginStart());
      const response = await authService.signIn(data);
      dispatch(loginSuccess(response));
      if (response) {
        dispatch(setUserStart());
        const userData = await userService.getMe();
        if (userData) {
          dispatch(setUserSuccess(userData));
          if (userData.data.roles[0] === ROLES.USER) {
            router.push(ROUTES.CA.HOME.path);
          } else if (userData.data.roles[0] === ROLES.ADMIN) {
            router.push(ROUTES.ADMIN.Home.path);
          } else if (userData.data.roles[0] === ROLES.RECRUITER) {
            router.push(ROUTES.CO.HOME.path);
          } else if (userData.data.roles[0] === ROLES.ADMIN_RECRUITER) {
            router.push(ROUTES.CO.HOME.path);
          }
        } else {
          dispatch(loginFailure('Failed to fetch user data'));
        }
      }
    } catch (error) {
      dispatch(loginFailure(error as string));
      toast.error(`${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome Back</h1>

      <GoogleSignButton
        text="Sign In with Google"
        redirectTo={`${window.location.origin}/auth/callback`}
      />

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="w-full"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link href="#" className="text-sm font-medium text-indigo-600">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      <div className="text-center text-sm">
        Don’t have an account?{' '}
        <Link
          href={ROUTES.AUTH.SIGNUP.path}
          className="font-medium text-indigo-600"
        >
          {ROUTES.AUTH.SIGNUP.name}
        </Link>
      </div>

      <div className="text-center text-xs text-gray-500">
        By signing in, you acknowledge that you have read and accept the{' '}
        <a href="#" className="text-indigo-600">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-indigo-600">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};
