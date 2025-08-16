'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import ROUTES from '@/constants/navigation';
import Link from 'next/link';
import {
  type ForgotPasswordRequest,
  forgotPasswordRequestSchema,
} from '@/schemas/Auth';
import { authService } from '@/services/api/auth/auth-api';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Logo from '../_components/Logo';

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    mode: 'onChange',
  });

  /**
   * Handles forgot password form submission
   */
  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      await authService.forgotPassword(data);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast.success('Password reset email sent successfully!');
    } catch (error) {
      toast.error(`Failed to send reset email: ${error}`);
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
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We&apos;ve sent password reset instructions to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm text-green-800">
                A password reset link has been sent to:
              </p>
              <p className="mt-1 font-medium text-green-900">
                {submittedEmail}
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Didn&apos;t receive the email?</strong>
              </p>
              <ul className="space-y-1 pl-4">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="w-full"
              >
                Try Different Email
              </Button>

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
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <form
            onSubmit={handleSubmit(handleForgotPassword)}
            className="space-y-4"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className={`transition-all duration-200 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.email.message}
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
                  Sending Email...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Reset Link
                </div>
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
