'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ROUTES from '@/constants/navigation';
import Divider from '../_components/Divider';
import Logo from '../_components/Logo';
import Navigation from '../_components/Navigation';
import GoogleSignButton from '../_components/GoogleSignButton';
import Link from 'next/link';
import { SignUpRequest, signUpRequestSchema } from '@/schemas/Auth';
import { authService } from '@/services/api/auth/auth-api';
import { toast } from 'react-toastify';

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpRequestSchema),
  });

  const onSubmit = async (data: SignUpRequest) => {
    try {
      await authService.signUp(data);
      toast.success('Sign up successful!', {
        className: 'bg-green-500 text-white font-semibold',
        onClose: () => reset(),
      });
    } catch (error) {
      toast.error(`${error}`, {
        className: 'bg-red-500 text-white font-semibold',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Get more opportunities</h1>

      <GoogleSignButton text="Sign Up with Google" />

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Full name
          </label>
          <Input
            id="name"
            placeholder="Enter your full name"
            className="w-full"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <Input
            id="username"
            placeholder="Enter your username"
            className="w-full"
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </Button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link
          href={ROUTES.AUTH.SIGNIN.path}
          className="font-medium text-indigo-600"
        >
          {ROUTES.AUTH.SIGNIN.name}
        </Link>
      </div>

      <div className="text-center text-xs text-gray-500">
        By clicking Continue, you acknowledge that you have read and accept the{' '}
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

export default function SignUpPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Logo />
      <Navigation />
      <SignUpForm />
    </div>
  );
}
