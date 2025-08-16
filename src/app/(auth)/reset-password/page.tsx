'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import ROUTES from '@/constants/navigation';
import Link from 'next/link';
import {
  type ResetPasswordFormData,
  type ResetPasswordRequest,
  resetPasswordFormSchema,
} from '@/schemas/Auth';
import { authService } from '@/services/api/auth/auth-api';
import { toast } from 'react-toastify';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import Logo from '../_components/Logo';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('newPassword', '');

  useEffect(() => {
    if (!searchParams) {
      toast.error('Invalid reset link');
      router.push(ROUTES.AUTH.SIGNIN.path);
      return;
    }

    const resetToken = searchParams.get('token');
    if (!resetToken) {
      toast.error('Invalid or missing reset token');
      router.push(ROUTES.AUTH.SIGNIN.path);
      return;
    }
    setToken(resetToken);
  }, [searchParams, router]);

  /**
   * Handles password reset form submission
   */
  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!token) {
      console.error('❌ No token available');
      toast.error('Reset token is missing');
      return;
    }

    try {
      const resetData: ResetPasswordRequest = { ...data, token };
      await authService.resetPassword(resetData);
      setIsSuccess(true);
      toast.success('Password reset successful!');
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes('expired') ||
        errorMessage.includes('invalid')
      ) {
        toast.error(
          'Reset link has expired or is invalid. Please request a new one.',
        );
      } else {
        toast.error(`Failed to reset password: ${errorMessage}`);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-md">
        <Logo />
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent">
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your password has been updated successfully
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm text-green-800">
                You can now sign in with your new password
              </p>
            </div>

            <Link href={ROUTES.AUTH.SIGNIN.path} className="block w-full">
              <Button className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-800 hover:to-blue-900">
                Continue to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md">
        <Logo />
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-gray-600">
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-sm text-red-800">
                Please request a new password reset link
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href={ROUTES.AUTH.FORGOT_PASSWORD.path}
                className="block w-full"
              >
                <Button className="w-full">Request New Reset Link</Button>
              </Link>

              <Link href={ROUTES.AUTH.SIGNIN.path} className="block w-full">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Logo />
      <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent">
            Set New Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter a strong new password for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            {/* New Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Lock className="h-4 w-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className={`pr-10 transition-all duration-200 ${
                    errors.newPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.newPassword.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Password Strength Meter */}
            {passwordValue && (
              <div className="rounded-lg border bg-gray-50 p-4">
                <PasswordStrengthMeter password={passwordValue} />
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Lock className="h-4 w-4" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`pr-10 transition-all duration-200 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.confirmPassword.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-800 hover:to-blue-900 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>

          {/* Back to Sign In */}
          <div className="pt-4 text-center">
            <Link
              href={ROUTES.AUTH.SIGNIN.path}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
